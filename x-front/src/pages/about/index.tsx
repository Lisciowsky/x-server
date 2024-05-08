import * as React from "react";
import Head from 'next/head';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Jane Doe",
    position: "Lead Developer",
    description: "Expert in frontend technologies and UX design.",
    imageUrl: "/dear.jpeg",
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
      <h1 className="text-4xl font-serif tracking-tight text-rich-black text-center">
        About Our Team
      </h1>
      <div className="mt-5 mb-5 grid md:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="bg-cultured text-rich-black">
            <CardHeader>
              <img className="rounded-xl" src={member.imageUrl} alt={member.name} width={member.imageWidth} height={member.imageHeight} />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-3 underline text-lg">{member.name}</CardTitle>
              <CardDescription className="text-md">{member.position}</CardDescription>
              <p className="mt-2 text-sm">{member.description}</p>
            </CardContent>
            <CardFooter className="grid container mx-auto justify-center">
              <Button className="hover:bg-sunset-orange rounded-xl mt-5">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-15 text-center rounded-lg">
        <h2 className="text-4xl font-serif tracking-tight text-rich-black text-center">Our Vision</h2>
        <p className="text-sonic-silver flex container mx-auto justify-center m-5 bg-cultured rounded-2xl p-5">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error tempore obcaecati ex et fuga, quia voluptatem fugit consequatur. Dignissimos odio perferendis asperiores hic! Dolores dignissimos veniam ipsam repellat, ducimus quo!
          Eos corporis iste magnam totam ex sint eaque! Ad libero non voluptatibus officia assumenda eum recusandae sit amet tempora, molestiae laboriosam sunt aperiam consectetur quas blanditiis iusto pariatur aut perspiciatis!
          Minus soluta facere ea sequi voluptatem quas ex? Consequuntur saepe quidem architecto neque nam iusto? Consequuntur libero deserunt, consectetur minus velit tempore sunt suscipit sint quia enim. Vel, doloremque quaerat.
          Amet saepe molestias, ipsam inventore exercitationem necessitatibus, aut consectetur nostrum omnis temporibus ducimus provident earum est? Tenetur minus iusto totam autem ducimus, sequi, optio voluptas voluptate quibusdam impedit, aut iure.
        </p>
      </div>
    </div>
  );
}

