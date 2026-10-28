import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import { 
  Search, MapPin, Pin, BookOpen, Route, Clock, Star, Navigation, 
  Plus, Minus, CloudSun, Compass, Landmark, Tent
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Traffic lights component inside Maps Sidebar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function Maps({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activePresetId, setActivePresetId] = useState("akid_lotfi");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [is3D, setIs3D] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Mock Preset Locations
  const presets = [
    {
      id: "akid_lotfi",
      name: "Akid Lotfi Mediterranean Garden",
      category: "Public Garden / Park",
      address: "Akid Lotfi, Oran, Algeria",
      phone: "+213 41 00 00 00",
      website: "oran-tourisme.dz",
      lat: 35.705720,
      lon: -0.638357,
      bbox: "-0.648357%2C35.698720%2C-0.628357%2C35.712720",
      icon: <Star size={14} className="text-white fill-white" />
    },
    {
      id: "goldengate",
      name: "Golden Gate Bridge",
      category: "Bridge / Landmark",
      address: "Golden Gate Bridge, San Francisco, CA, USA",
      phone: "+1 (415) 921-5858",
      website: "goldengate.org",
      lat: 37.8199,
      lon: -122.4783,
      bbox: "-122.490%2C37.812%2C-122.466%2C37.827",
      icon: <Landmark size={14} className="text-white fill-white" />
    }
  ];

  const allLocations = [...presets, ...searchResults];
  const currentPreset = allLocations.find(p => p.id === activePresetId) || allLocations[0];

  // Initialize and manage Leaflet map
  useEffect(() => {
    if (is3D || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [currentPreset.lat, currentPreset.lon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isDarkMode, is3D]);

  // Update marker & camera on preset change
  useEffect(() => {
    if (is3D || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.flyTo([currentPreset.lat, currentPreset.lon], 15.5, {
      duration: 1.2,
    });

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const isAkidLotfi = currentPreset.id === "akid_lotfi";

    const markerHtml = isAkidLotfi
      ? `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto; cursor: pointer;">
          <!-- Floating Glass Callout Badge with Italic Font -->
          <div style="position: relative; margin-bottom: 8px; padding: 6px 14px; border-radius: 9999px; display: flex; align-items: center; gap: 8px; background: rgba(13, 17, 23, 0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.22); box-shadow: 0 12px 30px rgba(0,0,0,0.5); white-space: nowrap;">
            <!-- Heart Icon -->
            <div style="width: 18px; height: 18px; border-radius: 9999px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); display: flex; items-center: center; justify-content: center; flex-shrink: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#fb7185" stroke="#fb7185" style="margin: auto; display: block;">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <!-- Italic Styled Location Text -->
            <span style="font-family: 'Georgia', 'Playfair Display', -apple-system, serif; font-style: italic; font-weight: 600; font-size: 13px; letter-spacing: 0.02em; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
              my favorite location :) / my city
            </span>
            <!-- Small speech bubble triangle -->
            <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background: rgba(13, 17, 23, 0.88); border-right: 1px solid rgba(255, 255, 255, 0.22); border-bottom: 1px solid rgba(255, 255, 255, 0.22);"></div>
          </div>

          <!-- Apple Maps Green Pin -->
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 34px; height: 34px; border-radius: 9999px; background: linear-gradient(180deg, #34d399 0%, #059669 100%); border: 2.5px solid #ffffff; box-shadow: 0 6px 18px rgba(16, 185, 129, 0.6); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <!-- Pin Ground Shadow -->
            <div style="position: absolute; bottom: -4px; width: 14px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 9999px; filter: blur(1px);"></div>
          </div>
        </div>
      `
      : `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto; cursor: pointer;">
          <div style="position: relative; margin-bottom: 6px; padding: 4px 10px; border-radius: 9999px; background: rgba(13, 17, 23, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.4); white-space: nowrap;">
            <span style="font-size: 11.5px; font-weight: 500; color: #ffffff;">${currentPreset.name}</span>
            <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 6px; height: 6px; background: rgba(13, 17, 23, 0.85); border-right: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2);"></div>
          </div>
          <div style="width: 32px; height: 32px; border-radius: 9999px; background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%); border: 2px solid #ffffff; box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5); display: flex; align-items: center; justify-content: center; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `;

    markerRef.current = L.marker([currentPreset.lat, currentPreset.lon], {
      icon: L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-marker",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
    }).addTo(map);
  }, [currentPreset, is3D]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    
    // First, check if it matches existing presets or search results
    const match = allLocations.find(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    if (match) {
      setActivePresetId(match.id);
      return;
    }

    // Otherwise, fetch from Nominatim OpenStreetMap API
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        
        const latMin = parseFloat(result.boundingbox[0]);
        const latMax = parseFloat(result.boundingbox[1]);
        const lonMin = parseFloat(result.boundingbox[2]);
        const lonMax = parseFloat(result.boundingbox[3]);
        
        const bbox = `${lonMin}%2C${latMin}%2C${lonMax}%2C${latMax}`;
        
        const newLoc = {
          id: `search-${Date.now()}`,
          name: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
          category: "Search Result",
          address: result.display_name,
          lat,
          lon,
          bbox,
          icon: <MapPin size={14} className="text-white fill-white" />
        };
        
        setSearchResults(prev => [newLoc, ...prev]);
        setActivePresetId(newLoc.id);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div 
      className={`maps-container w-full h-full select-none text-[13px] rounded-xl overflow-hidden font-sans relative ${
        isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
      }`}
    >
      
      {/* 1. Main Background Map Viewport */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {is3D ? (
          <iframe
            src={`https://demo.f4map.com/#lat=${currentPreset.lat}&lon=${currentPreset.lon}&zoom=18`}
            className="w-[calc(100%+320px)] h-[calc(100%+160px)] -top-[80px] -left-[240px] absolute border-none"
            title="3D Map Viewport"
          />
        ) : (
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />
        )}
      </div>

      {/* 2. Floating Sidebar Panel */}
      {isSidebarOpen && (
        <aside className={`absolute left-5 top-5 bottom-5 w-[260px] z-10 flex flex-col rounded-3xl border shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${
          isDarkMode 
            ? "border-white/10 bg-[#1E201E]/75 backdrop-blur-xl text-white" 
            : "border-black/5 bg-[#f4f7f4]/75 backdrop-blur-xl text-gray-900"
        } transition-all duration-300`}>
          
          {/* Header */}
          <div className="window-drag-handle p-4 pb-2 shrink-0 flex items-center justify-between">
            <TrafficLights windowId={windowId} />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition ${isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"}`}
              title="Hide Sidebar"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="currentcolor">
                <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="5.5" y1="1.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-3 shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <div className={`flex items-center rounded-xl px-3 py-1.5 border transition-all duration-200 ${
                isDarkMode 
                  ? "bg-black/25 border-white/5 text-gray-300 focus-within:border-blue-500/50" 
                  : "bg-black/[0.04] border-black/5 text-gray-800 focus-within:bg-white focus-within:border-blue-500/30 shadow-xs"
              }`}>
                <Search size={14} className="text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search Maps"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[12.5px] outline-none placeholder-gray-400 text-inherit"
                />
              </div>
            </form>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto notes-no-scrollbar px-3 space-y-4" style={{ scrollbarWidth: "none" }}>
            
            {/* Places Section */}
            <div className="space-y-0.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500">Places</div>
              <div className="space-y-0.5 text-[13px]">
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <Pin size={15} className="text-gray-500 dark:text-gray-400 rotate-45" />
                  <span className="font-medium">Pinned</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <MapPin size={15} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Saved Places</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <BookOpen size={15} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Guides</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <Route size={15} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Routes</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <Clock size={15} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Recently Added</span>
                </div>
              </div>
            </div>

            {/* Recents Section */}
            <div className="space-y-0.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500">Recents</div>
              <div className="space-y-0.5">
                {allLocations.map(p => {
                  const isSelected = activePresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePresetId(p.id)}
                      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition ${
                        isSelected 
                          ? isDarkMode ? "bg-white/10" : "bg-black/5" 
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#007AFF] text-white">
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[13px] truncate">{p.name}</h3>
                        <p className="text-[10.5px] text-gray-400 dark:text-gray-500 truncate">{p.address.split(",")[0]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => {
                  setSearchResults([]);
                  setActivePresetId("akid_lotfi");
                }}
                className="px-2 py-1 text-[11.5px] text-[#007AFF] hover:underline mt-1 block font-medium"
              >
                Clear Recents
              </button>
            </div>

          </div>

          {/* Terms & Conditions Footer Link */}
          <div className="px-5 py-4 shrink-0 flex items-center justify-start mt-auto">
            <button className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition font-medium">
              Terms & Conditions ›
            </button>
          </div>

        </aside>
      )}

      {/* Toggle Sidebar Button when sidebar is hidden */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`absolute left-5 top-5 w-8 h-8 rounded-full z-20 flex items-center justify-center border shadow-md transition ${
            isDarkMode 
              ? "bg-[#1E1E1E] border-white/10 text-white hover:bg-white/[0.08]" 
              : "bg-white border-black/5 text-gray-800 hover:bg-black/[0.04]"
          }`}
          title="Show Sidebar"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="currentcolor">
            <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="5.5" y1="1.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      )}

      {/* 3. Top Center: Scale Widget */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-end justify-center pointer-events-none select-none">
        <div className="flex flex-col items-center">
          <div className="flex gap-4 text-[9px] text-black font-semibold tracking-wide dark:text-white leading-none">
            <span>0</span>
            <span>2.5</span>
            <span>5 km</span>
          </div>
          {/* Scale line */}
          <svg width="60" height="6" viewBox="0 0 60 6" fill="none" className="mt-1">
            <line x1="0" y1="3" x2="60" y2="3" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="0.6" y1="0" x2="0.6" y2="6" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="30" y1="0" x2="30" y2="6" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="59.4" y1="0" x2="59.4" y2="6" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </div>
      </div>

      {/* 4. Top Right: Floating Maps Utility Controls */}
      <div className="absolute top-5 right-5 flex flex-col gap-2.5 z-10 pointer-events-auto items-center">
        {/* Landmark campsite icon */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#2C2C2E] text-[#D08B00] shadow-md border border-black/5 dark:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition">
          <Tent size={14} className="fill-[#D08B00]/20" />
        </button>

        {/* Compass location tracker / Re-center */}
        <button 
          onClick={() => {
            mapInstanceRef.current?.flyTo([currentPreset.lat, currentPreset.lon], 16, { duration: 1.2 });
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#2C2C2E] text-blue-500 shadow-md border border-black/5 dark:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition"
          title="Re-center on Location"
        >
          <Navigation size={13} className="fill-blue-500/10 rotate-[25deg]" />
        </button>

        {/* 2D / 3D Toggle */}
        <button 
          onClick={() => setIs3D(!is3D)}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-black/5 dark:border-white/10 transition font-bold text-[10.5px] ${
            is3D 
              ? "bg-[#007AFF] text-white hover:bg-blue-600" 
              : "bg-white dark:bg-[#2C2C2E] text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          }`}
          title="Toggle 3D View"
        >
          {is3D ? "2D" : "3D"}
        </button>

        {/* Zoom capsule controls */}
        <div className="flex flex-col border border-black/5 dark:border-white/10 rounded-full overflow-hidden shadow-md bg-white dark:bg-[#2C2C2E]">
          <button 
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 flex items-center justify-center border-b border-black/5 dark:border-white/5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition text-gray-600 dark:text-gray-300"
            title="Zoom In"
          >
            <Plus size={14} />
          </button>
          <button 
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition text-gray-600 dark:text-gray-300"
            title="Zoom Out"
          >
            <Minus size={14} />
          </button>
        </div>

        {/* N Dial Compass widget */}
        <div 
          onClick={() => {
            mapInstanceRef.current?.setView([currentPreset.lat, currentPreset.lon], 16);
          }}
          className="relative w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center shadow-md border border-black/5 dark:border-white/10 select-none cursor-pointer"
          title="Reset Heading"
        >
          <span className="absolute top-0.5 text-[8px] font-bold text-gray-400">N</span>
          <div className="w-0.5 h-4 bg-red-500 rounded-full rotate-45 transform origin-center" />
        </div>
      </div>

      {/* 5. Bottom Right: Weather/Air Quality widget */}
      <div className={`absolute bottom-5 right-5 z-10 px-3 py-1.5 rounded-2xl flex items-center gap-2 border shadow-md ${
        isDarkMode 
          ? "bg-[#2C2C2E]/90 border-white/10 text-white" 
          : "bg-white/90 border-black/5 text-gray-800"
      }`}>
        <CloudSun size={15} className="text-amber-500" />
        <span className="font-bold text-[12.5px] leading-none">23°</span>
        <div className="w-px h-3 bg-black/10 dark:bg-white/10" />
        <span className="text-[10px] font-bold tracking-wide uppercase text-gray-400">AQI</span>
      </div>

    </div>
  );
}
