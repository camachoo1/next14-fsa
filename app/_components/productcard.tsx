"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
interface ProductCardProps {
  imgs: string[];
  alt: string;
}

export const ProductCard = ({ imgs, alt }: ProductCardProps) => {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {imgs.map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center overflow-auto object-fill p-6">
                  <Image
                    src={img}
                    alt={`${alt} ${index + 1}`}
                    width={300}
                    height={300}
                    className="text-4xl font-semibold"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
