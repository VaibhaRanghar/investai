import { Button } from "@/components/v2/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <LandingPage /> */}
      <div className="w-full h-screen flex flex-col gap-5 justify-center items-center ">
        <h1 className="text-2xl font-semibold">
          Everything moved to InvestAI version 2.
        </h1>
        <Link href={"/v2"}>
          <Button variant="primary">Visit InvestAI V2</Button>
        </Link>
      </div>
    </>
  );
}
