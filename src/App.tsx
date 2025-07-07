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
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import mapStyle from "./style/MapStyle";

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const center = { lat: -36.856, lng: 174.762 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  function handleTagToggle(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }

  const filteredSpots = spots.filter((spot) => {
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every(tag => spot.tags.includes(tag));

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      spot.title.toLowerCase().includes(query) ||
      spot.description.toLowerCase().includes(query);

    return matchesTags && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-2/5 p-4 space-y-6 overflow-y-auto">
        <div className="flex flex-col items-start space-y-2">
          <img src={logo} className="w-48 md:w-56" alt="StudyAuckland logo" />
        </div>
        <div className="grid w-full gap-3">
          <Label htmlFor="message">SpotSearcher</Label>
          <Textarea
            className="resize-none"
            placeholder="Search here if you have a specific cafe or keyword in mind"
            id="message"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-col gap-6">
            <Label>Vibe Filters</Label>
            {[
              "Easy parking",
              "Gluten Free",
              "Keto",
              "Dim",
              "Library",
              "Free WiFi"
            ].map((tag, index) => (
              <div key={index} className="flex items-start gap-3">
                <Checkbox
                  id={`tag-${index}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <Label htmlFor={`tag-${index}`}>{tag}</Label>
              </div>
            ))}
          </div>

          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <Button className="w-full" variant="outline">
                Take a sec to read our study manners ❤
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Manners and Advice</AlertDialogTitle>
                <AlertDialogDescription>
                  The purpose of StudyAuckland is to enable an informative way to explore where best to work, study, and overall be productive in the greatest city in the world!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Make sure if you stay any meaningful amount of time somewhere, and if you're able to, <b>support commercial business by purchasing food and drinks</b>. It costs money to run them and it is necessary to be complimentary to the space.
              </AlertDialogDescription>
              <AlertDialogDescription>
                There is no "my reserved space" (unless you expressly have an arrangement). Hoarding, hogging, and keeping a spot is like telling people it's your sidewalk.
              </AlertDialogDescription>
              <AlertDialogDescription>
                General respect goes a long way ❤
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/5 flex flex-col overflow-hidden">
        <div className="h-64 w-full border rounded-xl overflow-hidden shrink-0">
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

        {/* Vibe Spot Cards */}
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
  );
}

export default App