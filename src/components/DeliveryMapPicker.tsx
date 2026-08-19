'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Search, ExternalLink, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface DeliveryLocationData {
  lat: number;
  lng: number;
  address: string;
  distance: number;
  isWithinRadius: boolean;
}

interface DeliveryMapPickerProps {
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantAddress?: string;
  deliveryRadiusKm?: number;
  yandexEdaUrl?: string;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onLocationChange: (data: DeliveryLocationData) => void;
}

// Calculate Haversine distance in kilometers
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const DeliveryMapPicker: React.FC<DeliveryMapPickerProps> = ({
  restaurantLat = 55.65406,
  restaurantLng = 37.498877,
  restaurantAddress = 'Ленинский проспект, 146 (Отель Аструс)',
  deliveryRadiusKm = 2,
  yandexEdaUrl = '',
  initialLat,
  initialLng,
  initialAddress = '',
  onLocationChange
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const clientMarkerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);

  const [currentLat, setCurrentLat] = useState<number>(initialLat || restaurantLat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || restaurantLng);
  const [addressInput, setAddressInput] = useState<string>(initialAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [distance, setDistance] = useState<number>(0);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean>(true);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Update distance calculation
  const updateDistanceAndNotify = useCallback(
    (lat: number, lng: number, address: string) => {
      const dist = calculateHaversineKm(restaurantLat, restaurantLng, lat, lng);
      const within = dist <= deliveryRadiusKm;
      setDistance(dist);
      setIsWithinRadius(within);
      setCurrentLat(lat);
      setCurrentLng(lng);
      setAddressInput(address);

      onLocationChange({
        lat,
        lng,
        address,
        distance: dist,
        isWithinRadius: within
      });
    },
    [restaurantLat, restaurantLng, deliveryRadiusKm, onLocationChange]
  );

  // Reverse geocoding via Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ru`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const street = addr.road || addr.street || addr.pedestrian || addr.suburb || '';
          const house = addr.house_number || addr.building || '';
          
          let formatted = '';
          if (street) {
            formatted = house ? `${street}, ${house}` : street;
          } else {
            formatted = data.display_name?.split(',').slice(0, 3).join(',') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          }
          return formatted;
        }
      }
    } catch (e) {
      console.error('Reverse geocode error:', e);
    } finally {
      setIsSearching(false);
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  // Search forward geocode
  const searchAddress = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ', Москва'
      )}&limit=5&accept-language=ru&viewbox=37.3,55.8,37.7,55.5&bounded=0`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      }
    } catch (e) {
      console.error('Geocode search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Dynamically load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inject Leaflet CSS if missing
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Load Leaflet library
    import('leaflet').then((L) => {
      setIsLeafletReady(true);
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Voyager / OSM tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // 1. Restaurant Marker (Gold Pin)
      const restaurantIcon = L.divIcon({
        className: 'custom-restaurant-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #18140E 0%, #0D0A07 100%);
            border: 2px solid #D4AF37;
            border-radius: 12px;
            padding: 4px 8px;
            box-shadow: 0 4px 15px rgba(212,175,55,0.4);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            transform: translate(-50%, -100%);
          ">
            <span style="font-size: 13px;">🍷</span>
            <span style="font-size: 10px; font-weight: 900; color: #F5E6BE; font-family: serif; letter-spacing: 1px;">PORTO BAR</span>
          </div>
        `,
        iconSize: [100, 36],
        iconAnchor: [0, 0]
      });

      L.marker([restaurantLat, restaurantLng], { icon: restaurantIcon, interactive: false }).addTo(map);

      // 2. Radius Circle (2 km limit)
      const circle = L.circle([restaurantLat, restaurantLng], {
        radius: deliveryRadiusKm * 1000,
        color: '#D4AF37',
        weight: 2,
        dashArray: '4, 6',
        fillColor: '#D4AF37',
        fillOpacity: 0.08
      }).addTo(map);
      radiusCircleRef.current = circle;

      // 3. Client Delivery Pin (Draggable)
      const clientIcon = L.divIcon({
        className: 'custom-client-marker',
        html: `
          <div style="
            background: #E11D48;
            border: 2px solid #FFFFFF;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg) translate(8px, -8px);
            box-shadow: 0 4px 12px rgba(225,29,72,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
          ">
            <div style="
              width: 9px;
              height: 9px;
              background: #FFFFFF;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const clientMarker = L.marker([currentLat, currentLng], {
        icon: clientIcon,
        draggable: true
      }).addTo(map);

      clientMarker.on('dragend', async (e: any) => {
        const pos = e.target.getLatLng();
        const detectedAddress = await reverseGeocode(pos.lat, pos.lng);
        updateDistanceAndNotify(pos.lat, pos.lng, detectedAddress);
      });

      // Map click handler
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        clientMarker.setLatLng([lat, lng]);
        const detectedAddress = await reverseGeocode(lat, lng);
        updateDistanceAndNotify(lat, lng, detectedAddress);
      });

      clientMarkerRef.current = clientMarker;
      mapInstanceRef.current = map;

      // Initial calculation
      const initialDist = calculateHaversineKm(restaurantLat, restaurantLng, currentLat, currentLng);
      setDistance(initialDist);
      setIsWithinRadius(initialDist <= deliveryRadiusKm);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady, restaurantLat, restaurantLng, deliveryRadiusKm, updateDistanceAndNotify]);

  // Handle Geolocation Click
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current && clientMarkerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          clientMarkerRef.current.setLatLng([latitude, longitude]);
        }
        const detectedAddress = await reverseGeocode(latitude, longitude);
        updateDistanceAndNotify(latitude, longitude, detectedAddress);
        setIsLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Не удалось определить местоположение. Пожалуйста, укажите точку на карте вручную.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle selecting an address suggestion
  const handleSelectSearchResult = (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Shorten display name
    const shortName = result.display_name.split(',').slice(0, 3).join(',');
    
    if (mapInstanceRef.current && clientMarkerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      clientMarkerRef.current.setLatLng([lat, lng]);
    }
    updateDistanceAndNotify(lat, lng, shortName);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-3 text-left">
      {/* Search Input & Geolocation Button */}
      <div className="relative">
        <div className="flex gap-1.5 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-porto-gold/70" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                searchAddress(e.target.value);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder={t('checkout.addressPlaceholder')}
              className="w-full bg-porto-bg/85 border border-porto-gold/25 focus:border-porto-gold-bright rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-gray-500 font-semibold focus:outline-none transition-colors shadow-inner"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-porto-gold animate-spin" />
            )}
          </div>

          <button
            type="button"
            onClick={handleGetMyLocation}
            disabled={isLocating}
            title={t('checkout.myLocation')}
            className="bg-porto-gold/15 hover:bg-porto-gold/25 border border-porto-gold/30 text-porto-gold-bright p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer shadow"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-porto-gold" />
            ) : (
              <Navigation className="w-4 h-4 text-porto-gold" />
            )}
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-porto-bg/95 backdrop-blur-md border border-porto-gold/30 rounded-xl shadow-2xl overflow-hidden divide-y divide-white/5 max-h-48 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(res)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-porto-gold/15 transition-colors text-[11px] text-gray-200 flex items-start gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-porto-gold mt-0.5 shrink-0" />
                <span className="line-clamp-2">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Wrapper */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-porto-gold/25 shadow-lg bg-black/40">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Floating Hint */}
        <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none flex justify-between items-center">
          <span className="bg-black/80 backdrop-blur-md text-[9px] font-bold text-gray-300 px-2.5 py-1 rounded-full border border-white/10 shadow">
            📍 {t('checkout.pinLocation')}
          </span>
          <span className="bg-black/80 backdrop-blur-md text-[9px] font-bold text-porto-gold px-2.5 py-1 rounded-full border border-porto-gold/30 shadow">
            Радиус: {deliveryRadiusKm} км
          </span>
        </div>
      </div>

      {/* Distance & Delivery Zone Status Message */}
      {isWithinRadius ? (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-300">
              {t('checkout.inDeliveryZone').replace('{dist}', String(distance))}
            </p>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
            Доставим
          </span>
        </div>
      ) : (
        <div className="space-y-2.5 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl shadow-lg">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-200 leading-snug">
                {t('checkout.outOfDeliveryZone').replace('{radius}', String(deliveryRadiusKm))}
              </p>
              <p className="text-[10px] text-gray-400">
                Ваше расстояние: <strong className="text-amber-300">{distance} км</strong> от ресторана (Отель Аструс).
              </p>
            </div>
          </div>

          {/* Yandex Eda Redirect or Unavailability Notice */}
          {yandexEdaUrl ? (
            <div className="pt-2 border-t border-amber-500/20 space-y-2">
              <p className="text-[11px] text-gray-300 font-medium">
                {t('checkout.yandexEdaAlternative')}
              </p>
              <a
                href={yandexEdaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FFE800] hover:bg-[#FEE100] text-black font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <span>{t('checkout.orderViaYandexEda')}</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </a>
            </div>
          ) : (
            <div className="pt-1.5 border-t border-amber-500/20">
              <p className="text-[11px] font-semibold text-gray-400 italic">
                {t('checkout.deliveryNotAvailable')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
