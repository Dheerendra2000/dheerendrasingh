"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/contentDefaults"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

export default function CourseCard({ course }: { course: Course }) {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 300 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / width
    const y = (e.clientY - top - height / 2) / height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const glareX = useTransform(springX, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["100%", "-100%"]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <Card
        className="flex flex-col overflow-hidden w-full h-full rounded-2xl"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(75px)" }}
      >
        <div
          style={{
            transform: "translateZ(40px)",
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          <Image
            src={course.thumbnail}
            alt={course.title}
            data-ai-hint={course.hint}
            width={600}
            height={400}
            className="object-cover w-full h-48"
          />
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{course.category}</Badge>
        </div>
        <CardHeader style={{ transform: "translateZ(50px)" }}>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow" />
        <CardFooter className="flex justify-between items-center" style={{ transform: "translateZ(30px)" }}>
          <p className="text-2xl font-bold text-primary">{course.price}</p>
          <Button asChild>
            <a href={course.link}>Learn More</a>
          </Button>
        </CardFooter>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "translateZ(20px)",
            background: `radial-gradient(
                circle at ${glareX.get()} ${glareY.get()},
                rgba(255, 255, 255, 0.2),
                rgba(255, 255, 255, 0) 50%
            )`,
            opacity: useTransform(springX, (v) => Math.abs(v) > 0.1 || Math.abs(mouseY.get()) > 0.1 ? 1 : 0),
            pointerEvents: "none",
            mixBlendMode: "soft-light",
          }}
        />
      </Card>
    </motion.div>
  )
}
