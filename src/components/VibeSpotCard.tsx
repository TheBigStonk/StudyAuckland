import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type VibeSpotCardProps = {
  image: string
  title: string
  description: string
  address: string
  tags: string[]
  wifiPassword?: string
  isActive?: boolean
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
  isSelected?: boolean
}

export function VibeSpotCard({
  image,
  title,
  description,
  address,
  tags,
  wifiPassword,
  isSelected,
  onHover,
  onLeave,
  onClick
}: VibeSpotCardProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className="flex items-center justify-center"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <Card
        className={`w-full p-3 border-2 ${
          isSelected ? "border-blue-500 shadow-md" : "border-transparent"
        } hover:cursor-pointer hover:scale-102`}
      >
        <CardHeader className="flex flex-row items-start gap-x-4 p-0">
          {/* Image */}
          <img
            src={image}
            className="rounded-md w-24 h-20 object-cover shrink-0"
            alt={title}
          />

          {/* Text Block */}
          <div className="relative flex-grow space-y-1 text-sm text-muted-foreground">
            {/* WiFi password button - positioned in top-right */}
            {wifiPassword && (
              <div className="absolute top-0 right-0">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs px-2 py-1"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent card onClick
                    setShowPassword(!showPassword)
                  }}
                >
                  {showPassword ? wifiPassword : "WiFi info"}
                </Button>
              </div>
            )}

            <CardTitle className="flex text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
            <CardDescription>📍 {address}</CardDescription>
            <CardDescription>🏷️ {tags.join(", ")}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
