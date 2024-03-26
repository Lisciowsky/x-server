import * as React from "react";
import Head from 'next/head';
// import Image from 'next/image';

// Assuming these components exist in your project structure
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Jane Doe",
    position: "Lead Developer",
    description: "Expert in frontend technologies and UX design.",
    imageUrl: "/dear.jpeg", // Assuming this image is in the public/images folder
    imageWidth: 400,
    imageHeight: 400,
  },
  {
    id: 2,
    name: "John Smith",
    position: "Project Manager",
    description: "Skilled in project management and team leadership.",
    imageUrl: "/bear.jpeg",
    imageWidth: 400,
    imageHeight: 400,
  },
  {
    id: 3,
    name: "Alice Johnson",
    position: "Founder",
    description: "Passionate about creating innovative tech solutions.",
    imageUrl: "/spider2.jpeg",
    imageWidth: 400,
    imageHeight: 400,
  },
];

export default function About() {
  return (
    <div className="px-4 py-8">
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our team and mission." />
      </Head>
      <h1 className="text-4xl font-extralight tracking-tight lg:text-4xl text-rich-black text-center">
        About Our Team
      </h1>
      <div className="mt-10 mb-10 grid md:grid-cols-3 gap-4 ">
        {teamMembers.map((member) => (
          <Card key={member.id} className="w-full bg-cultured text-rich-black">
            <CardHeader>
              <img className="rounded-xl"src={member.imageUrl} alt={member.name} width={member.imageWidth} height={member.imageHeight} />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-3 underline text-lg">{member.name}</CardTitle>
              <CardDescription className="text-md">{member.position}</CardDescription>
              <p className="mt-2 text-sm">{member.description}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="hover:bg-sunset-orange ">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-15 text-center rounded-lg">
        <h2 className="text-4xl font-extralight tracking-tight lg:text-4xl text-rich-black text-center">Our Vision</h2>
        <p className="text-rich-black flex container mx-auto justify-center m-5 bg-cultured rounded-2xl p-5">
          In a world inundated with information, our mission is to cut through the noise, offering our users a way to stay informed without feeling overwhelmed. By leveraging advanced AI models to scrape social media and distill this information into streamlined, concise news, we aim to save valuable time for those seeking to stay informed. Our vision is to transform the way news is consumed, making it more accessible, efficient, and relevant for today s fast-paced lifestyle. We are dedicated to innovation in the field of information processing and committed to creating a future where everyone can stay informed effortlessly. Through our technology, we strive to empower individuals with the knowledge they need to make informed decisions, fostering a well-informed community connected by the power of understanding.
        </p>
      </div>
    </div>
  );
}

