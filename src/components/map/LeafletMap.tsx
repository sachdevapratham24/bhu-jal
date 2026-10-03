import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCategory } from '../ui/CategoryPill'
import type { StateData } from '../../types'
import { RotateCcw } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'Safe': '#2d6a4f',
  'Semi-Critical': '#e9c46a',
  'Critical': '#f4a261',
  'Over-Exploited': '#e63946',
  'Data Pending': '#94a3b8',
}

const CATEGORY_FILL_OPACITY: Record<string, number> = {
  'Safe': 0.6,
  'Semi-Critical': 0.65,
  'Critical': 0.7,
  'Over-Exploited': 0.75,
  'Data Pending': 0.3,
}

// Normalise state name for fuzzy matching
function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

interface LeafletMapProps {
  statesData: StateData[]
  selectedState?: StateData | null
  onStateSelect: (stateName: string) => void
  onResetZoom?: () => void
}

export default function LeafletMap({ statesData, selectedState, onStateSelect, onResetZoom }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const geoLayerRef = useRef<L.GeoJSON | null>(null)
  const layersByStateRef = useRef<Record<string, L.Path>>({})
  const initialBoundsRef = useRef<L.LatLngBounds | null>(null)

  // Map initialization
  useEffect(() => {
    let isMounted = true
    if (!containerRef.current) return

    // Prevent 'Map container is already initialized' error in React strict mode
    if ((containerRef.current as unknown as { _leaflet_id?: string })._leaflet_id) {
      delete (containerRef.current as unknown as { _leaflet_id?: string })._leaflet_id
    }

    const map = L.map(containerRef.current, {
      center: [22.8, 79.5],
      zoom: 4.3,
      minZoom: 3.5,
      maxZoom: 7.5,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    })

    // Free OpenStreetMap tiles with multiple subdomains and error suppression
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 8,
    })
    tiles.on('tileerror', () => {
      // Gracefully ignore tile load errors - choropleth still renders on styled background
    })
    tiles.addTo(map)

    mapRef.current = map

    // Build normalised lookup
    const stateByNorm: Record<string, StateData> = {}
    statesData.forEach(s => {
      stateByNorm[normaliseName(s.state)] = s
    })

    // Find best match for a GeoJSON feature name
    const findMatch = (geoName: string): StateData | undefined => {
      const norm = normaliseName(geoName)
      if (stateByNorm[norm]) return stateByNorm[norm]
      for (const [key, state] of Object.entries(stateByNorm)) {
        if (norm.includes(key) || key.includes(norm)) return state
      }
      const aliases: Record<string, string> = {
        'jammu kashmir': 'jammu kashmir',
        'jammu and kashmir': 'jammu kashmir',
        'uttaranchal': 'uttarakhand',
        'orissa': 'odisha',
        'pondicherry': 'puducherry',
        'andaman and nicobar': 'andaman nicobar',
        'dadra nagar haveli': 'dadra nagar haveli',
        'daman diu': 'daman diu',
      }
      const alias = aliases[norm]
      if (alias && stateByNorm[alias]) return stateByNorm[alias]
      return undefined
    }

    // Fetch local GeoJSON (served from /public)
    fetch('/india-states.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(geojson => {
        if (!isMounted || !mapRef.current) return

        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const name: string = feature?.properties?.NAME_1 || ''
            const match = findMatch(name)
            const cat = getCategory(match?.stageOfExtractionPct ?? null)
            return {
              fillColor: CATEGORY_COLORS[cat] || '#94a3b8',
              fillOpacity: CATEGORY_FILL_OPACITY[cat] || 0.3,
              color: '#1a4a5c',
              weight: 1.5,
              opacity: 0.8,
            }
          },
          onEachFeature: (feature, l) => {
            const name: string = feature?.properties?.NAME_1 || ''
            const match = findMatch(name)
            const stateName = match ? match.state : name
            const cat = getCategory(match?.stageOfExtractionPct ?? null)
            const pctText =
              match?.stageOfExtractionPct != null
                ? `${match.stageOfExtractionPct.toFixed(1)}% extraction (${cat})`
                : 'Data Pending — CGWB 2025'

            // Store layer reference for external zoom / dropdown triggers
            layersByStateRef.current[normaliseName(stateName)] = l as L.Path
            if (name !== stateName) {
              layersByStateRef.current[normaliseName(name)] = l as L.Path
            }

            l.bindTooltip(
              `<div style="font-family: system-ui, sans-serif; padding: 2px;">
                <strong style="font-size: 13px; color: #0d3d4a;">${stateName}</strong><br/>
                <span style="font-size: 11px; color: #334155;">${pctText}</span><br/>
                <span style="font-size: 10px; color: #00b4d8; font-weight: 600;">Click to zoom & inspect 🔍</span>
              </div>`,
              { sticky: true }
            )

            l.on({
              mouseover: (e: L.LeafletMouseEvent) => {
                const target = e.target as L.Path
                target.setStyle({
                  fillOpacity: Math.min((CATEGORY_FILL_OPACITY[cat] || 0.3) + 0.25, 0.95),
                  weight: 2.5,
                  color: '#00b4d8',
                })
                target.bringToFront()
              },
              mouseout: (e: L.LeafletMouseEvent) => {
                if (geoLayerRef.current) {
                  geoLayerRef.current.resetStyle(e.target as L.Layer)
                }
              },
              click: () => {
                if ((l as any).getBounds && mapRef.current) {
                  mapRef.current.flyToBounds((l as any).getBounds(), {
                    padding: [50, 50],
                    maxZoom: 6.5,
                    duration: 1.2,
                  })
                }
                onStateSelect(stateName)
              },
            })
          },
        })

        if (!isMounted || !mapRef.current) return
        layer.addTo(map)
        geoLayerRef.current = layer

        try {
          const bounds = layer.getBounds()
          initialBoundsRef.current = bounds
          map.fitBounds(bounds, { padding: [20, 20] })
        } catch {
          map.setView([22.8, 79.5], 4.3)
        }
      })
      .catch(err => {
        if (!isMounted) return
        console.error('India GeoJSON load failed:', err)
        if (mapRef.current) {
          const div = L.divIcon({
            html: '<div style="background:rgba(13,61,74,0.9);color:#fff;padding:12px 16px;border-radius:8px;font-size:13px;max-width:260px;text-align:center">Use the dropdown below to select a state.</div>',
            className: '',
            iconSize: [280, 60],
          })
          L.marker([22.5, 80], { icon: div }).addTo(mapRef.current)
        }
      })

    return () => {
      isMounted = false
      if (geoLayerRef.current) {
        geoLayerRef.current.remove()
        geoLayerRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [statesData, onStateSelect])

  // Reactive zoom when selectedState changes (e.g., from dropdown or state click)
  useEffect(() => {
    if (!mapRef.current || !geoLayerRef.current) return

    if (selectedState) {
      const norm = normaliseName(selectedState.state)
      const targetLayer = layersByStateRef.current[norm]

      // Reset styles across all features
      geoLayerRef.current.eachLayer((l) => {
        geoLayerRef.current?.resetStyle(l as L.Layer)
      })

      if (targetLayer && (targetLayer as any).getBounds) {
        const bounds = (targetLayer as any).getBounds()
        mapRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 6.5,
          duration: 1.2,
        })
        targetLayer.setStyle({
          weight: 3.5,
          color: '#00b4d8',
          fillOpacity: 0.9,
        })
        targetLayer.bringToFront()
      }
    } else {
      // Zoom out to all of India
      geoLayerRef.current.eachLayer((l) => {
        geoLayerRef.current?.resetStyle(l as L.Layer)
      })
      if (initialBoundsRef.current) {
        mapRef.current.flyToBounds(initialBoundsRef.current, { padding: [20, 20], duration: 1.2 })
      } else {
        mapRef.current.flyTo([22.8, 79.5], 4.3, { duration: 1.2 })
      }
    }
  }, [selectedState])

  const handleReset = () => {
    if (onResetZoom) onResetZoom()
    if (mapRef.current) {
      if (initialBoundsRef.current) {
        mapRef.current.flyToBounds(initialBoundsRef.current, { padding: [20, 20], duration: 1.2 })
      } else {
        mapRef.current.flyTo([22.8, 79.5], 4.3, { duration: 1.2 })
      }
    }
    if (geoLayerRef.current) {
      geoLayerRef.current.eachLayer((l) => {
        geoLayerRef.current?.resetStyle(l as L.Layer)
      })
    }
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        aria-label="Interactive India map showing groundwater extraction levels by state"
        role="img"
      />
      {/* Reset Zoom to All India Floating Control */}
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 z-[10] bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 hover:border-[var(--color-aqua)]"
        title="Reset map view to whole country"
      >
        <RotateCcw size={13} className="text-[var(--color-aqua)]" />
        <span>View Whole India 🇮🇳</span>
      </button>
    </div>
  )
}
