"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import "../globals.css";

export default function DashBoard() {
	const [count, setCount] = useState(0);

	function onJump() {
		console.log("Bear is jumping!");
	}
	return (
		<div className="flex flex-col gap-2">
			<button className="circle-button">
				Wave
			</button>
			<button className="circle-button">
				Jump
			</button>
			<button className="circle-button">
				Sit
			</button>
			<button className="circle-button">
				Raise Hand
			</button>
			<button className="circle-button">
				Shake Head
			</button>
			<button className="circle-button">
				lay Down
			</button>
			<button className="circle-button">
				Dance
			</button>
		</div>
	);
}
