import { useState } from 'react'
import logo from '/studyauckland-high-resolution-logo.png'
import './App.css'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { VibeSpotCard } from '@/components/VibeSpotCard'
import { spots } from './data/spots'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import mapStyle from "./style/MapStyle"

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const center = { lat: -36.856, lng: 174.762 }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  function handleTagToggle(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredSpots = spots.filter((spot) => {
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every(tag => spot.tags.includes(tag))

    const query = searchQuery.toLowerCase()
    const matchesSearch =
      spot.title.toLowerCase().includes(query) ||
      spot.description.toLowerCase().includes(query)

    return matchesTags && matchesSearch
  })

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar / Top Controls */}
      <div className="w-full md:w-2/5 md:h-full p-4 space-y-6 overflow-y-auto md:sticky md:top-0 bg-background z-10 min-h-[240px]">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <img src={logo} className="w-40 md:w-56" alt="StudyAuckland logo" />
        </div>

        {/* Search input (desktop only) */}
        <div className="hidden md:grid w-full gap-3">
          <Label htmlFor="message">Searcher</Label>
          <Textarea
            className="resize-none"
            placeholder="Search here if you have a specific cafe or keyword in mind"
            id="message"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Vibe Filters (mobile only) */}
        <div >
          <div className="flex flex-col gap-4">
            <Label>Vibe Filters</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                "Easy parking",
                "Gluten Free",
                "Good food",
                "Dim",
                "Bright",
                "Quiet",
                "Social",
                "Free WiFi"
              ].map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${index}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label htmlFor={`tag-${index}`}>{tag}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manners Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="hidden md:block w-full" variant="outline">
              Study Manners ❤
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Manners and Advice</AlertDialogTitle>
              <AlertDialogDescription>
                The purpose of StudyAuckland is to enable an informative way to explore where best to work, study, and be productive in the greatest city in the world!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Support commercial business by purchasing food or drinks if staying long. Respect the space.
            </AlertDialogDescription>
            <AlertDialogDescription>
              No space hoarding — it’s not your sidewalk.
            </AlertDialogDescription>
            <AlertDialogDescription>
              Respect goes a long way ❤
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/5 flex flex-col overflow-hidden">
        {/* Map */}
        <div className="h-64 md:h-[300px] w-full border-b md:border-none">
          {isLoaded && (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={center}
              zoom={13}
              options={{
                styles: mapStyle,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: true,
              }}
            >
              {filteredSpots.map((spot, index) => (
                <Marker
                  key={index}
                  position={{ lat: spot.lat, lng: spot.lng }}
                />
              ))}
            </GoogleMap>
          )}
        </div>

        {/* Spot Cards */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col space-y-4 p-4">
            {filteredSpots.map((spot, index) => (
              <VibeSpotCard
                key={index}
                image={spot.image}
                title={spot.title}
                description={spot.description}
                address={spot.address}
                tags={spot.tags}
                wifiPassword={spot.wifiPassword}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default App
