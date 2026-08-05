/* eslint-disable @typescript-eslint/no-explicit-any */
// Google Maps and Places API types
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: google.maps.MapOptions) => google.maps.Map
        MapOptions: {
          zoom?: number
          center?: google.maps.LatLng | google.maps.LatLngLiteral
          mapTypeId?: string
          styles?: any[]
        }
        MapTypeId: {
          ROADMAP: string
        }
        LatLng: new (lat: number, lng: number) => google.maps.LatLng
        LatLngLiteral: {
          lat: number
          lng: number
        }
        Geocoder: new () => google.maps.Geocoder
        GeocoderStatus: {
          OK: string
        }
        Marker: new (options?: google.maps.MarkerOptions) => google.maps.Marker
        MarkerOptions: {
          position?: google.maps.LatLng | google.maps.LatLngLiteral
          map?: google.maps.Map
          title?: string
          animation?: any
        }
        Animation: {
          DROP: any
        }
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete
          AutocompleteOptions: {
            types?: string[]
            componentRestrictions?: {
              country?: string
            }
          }
          AutocompletePrediction: {
            place_id: string
            description: string
            structured_formatting?: {
              main_text: string
              secondary_text: string
            }
          }
          AutocompleteService: new () => google.maps.places.AutocompleteService
          AutocompleteServiceStatus: {
            OK: string
          }
          PlacesService: new (attributionDiv?: HTMLElement) => google.maps.places.PlacesService
          PlacesServiceStatus: {
            OK: string
          }
        }
        event: {
          clearInstanceListeners: (instance: any) => void
        }
      }
    }
  }
}
