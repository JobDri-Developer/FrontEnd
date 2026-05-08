"use client";

import { useState } from "react";
import { ChipMain } from "./ChipMain";

export default function ChipMainDemo() {
  const [selected, setSelected] = useState("primary");

  return (
    <>
      <ChipMain
        label="primary"
        color="primary"
        selected={selected === "primary"}
        onClick={() => setSelected("primary")}
      />
      <ChipMain
        label="secondary"
        color="secondary"
        selected={selected === "secondary"}
        onClick={() => setSelected("secondary")}
      />
      <ChipMain
        label="tertiary"
        color="tertiary"
        selected={selected === "tertiary"}
        onClick={() => setSelected("tertiary")}
      />
      <ChipMain
        label="quaternary"
        color="quaternary"
        selected={selected === "quaternary"}
        onClick={() => setSelected("quaternary")}
      />
    </>
  );
}
