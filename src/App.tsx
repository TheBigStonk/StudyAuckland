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
    <>
      {/* Grid Container */}
      <div className="grid grid-cols-5 px-4 py-2 gap-8 h-screen">
        {/* Left Side (40%) */}
        <div className="col-span-2 space-y-6 overflow-y-auto">
          <div className="flex flex-col items-start space-y-2">
            <img src={logo} className="w-56" alt="StudyAuckland logo" />
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
              <Label htmlFor="message">Vibe Filters</Label>
              <div className="flex items-start gap-3">
                <Checkbox  
                  id="terms" checked={selectedTags.includes("Easy parking")}
                  onCheckedChange={() => handleTagToggle("Easy parking")} 
                />
                <div className="grid gap-2">
                  <Label htmlFor="terms">Easy Parking</Label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="terms-2"
                  checked={selectedTags.includes("Gluten Free")}
                  onCheckedChange={() => handleTagToggle("Gluten Free")} 
                />
                <Label htmlFor="terms-2">Gluten Free</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="terms-3" 
                  checked={selectedTags.includes("Keto")}
                  onCheckedChange={() => handleTagToggle("Keto")} 
                />
                <Label htmlFor="terms-3">Keto Friendly</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="terms-4" 
                  checked={selectedTags.includes("Dim")}
                  onCheckedChange={() => handleTagToggle("Dim")} 
                />
                <Label htmlFor="terms-4">Dim Lights</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="terms-5" 
                  checked={selectedTags.includes("Library")}
                  onCheckedChange={() => handleTagToggle("Library")} 
                />
                <Label htmlFor="terms-5">Very quiet</Label>
              </div>
              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="terms-6"
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  checked={selectedTags.includes("Free WiFi")}
                  onCheckedChange={() => handleTagToggle("Free WiFi")}
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="flex text-sm leading-none font-medium">
                  Free WiFi
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Uncheck for more human/nature-y places 🌿🌱
                  </p>
                </div>
              </Label>
            </div>
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <Button className="w-full" variant="outline" >
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

        {/* Right Side (60%) */}
        <div className="col-span-3 flex flex-col overflow-hidden">
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

          {/*Vibe Spot Cards*/}
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
    </>
  );
}

export default App
