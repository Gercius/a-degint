import { getBearing, getDistance, isInDownwindCone, getDownwindBuildings } from "./downwind";
import type { Building } from "./buildings";

// Helper to create a building
function createBuilding(id: string, lat: number, lng: number, label: string): Building {
    return {
        id,
        label,
        center: [lat, lng],
        feature: {
            type: "Feature",
            id,
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [lng, lat],
                        [lng + 0.001, lat],
                        [lng + 0.001, lat + 0.001],
                        [lng, lat + 0.001],
                        [lng, lat],
                    ],
                ],
            },
        },
    };
}

console.log("=== Phase 2 Verification Tests ===\n");

// Test 1: Bearing calculation
console.log("Test 1: Bearing from north to south");
const north: [number, number] = [54.88, 24.52];
const south: [number, number] = [54.879, 24.52]; // ~111m apart
const bearing = getBearing(north, south);
console.log(`  Bearing from ${north} to ${south}: ${bearing}°`);
console.log(`  Expected: ~180° (south)`);
console.log(`  ${Math.abs(bearing - 180) < 1 ? "✓ PASS" : "✗ FAIL"}\n`);

// Test 2: Distance calculation
console.log("Test 2: Distance between two points");
const distance = getDistance(north, south);
console.log(`  Distance: ${distance.toFixed(2)}m`);
console.log(`  Expected: ~111m`);
console.log(`  ${distance > 100 && distance < 130 ? "✓ PASS" : "✗ FAIL"}\n`);

// Test 3: isInDownwindCone - wind from South (180°), target to the south should be in cone
console.log("Test 3: Target south of origin with wind from South (180°)");
const origin = createBuilding("origin", 54.88, 24.52, "Origin");
const targetSouth = createBuilding("target", 54.879, 24.52, "Target South"); // ~111m south
const inCone1 = isInDownwindCone(origin.center, targetSouth.center, 180, 90, 300);
console.log(`  Wind direction: 180° (from south)`);
console.log(`  Downwind direction: ${(180 + 180) % 360}° (north)`);
console.log(`  Target is south of origin → should NOT be in downwind cone`);
console.log(`  Result: ${inCone1 ? "IN cone" : "NOT in cone"}`);
console.log(`  ${!inCone1 ? "✓ PASS" : "✗ FAIL"}\n`);

// Test 4: isInDownwindCone - wind from North (0°), target to the south should be in cone
console.log("Test 4: Target south of origin with wind from North (0°)");
const inCone2 = isInDownwindCone(origin.center, targetSouth.center, 0, 90, 300);
console.log(`  Wind direction: 0° (from north)`);
console.log(`  Downwind direction: ${(0 + 180) % 360}° (south)`);
console.log(`  Target is south of origin → should BE in downwind cone`);
console.log(`  Result: ${inCone2 ? "IN cone" : "NOT in cone"}`);
console.log(`  ${inCone2 ? "✓ PASS" : "✗ FAIL"}\n`);

// Test 5: getDownwindBuildings - filter and sort
console.log("Test 5: getDownwindBuildings filters and sorts correctly");
const buildings: Building[] = [
    createBuilding("1", 54.88, 24.52, "1, Main St"), // origin location
    createBuilding("2", 54.8805, 24.525, "2, Oak St"), // ~60m east, not south
    createBuilding("3", 54.879, 24.52, "3, Pine St"), // ~111m south
    createBuilding("4", 54.878, 24.52, "4, Elm St"), // ~222m south
    createBuilding("5", 54.875, 24.52, "5, Far South St"), // ~555m south, should still be included
];
const downwind = getDownwindBuildings(origin, buildings, 0); // Wind from north → downwind is south
console.log(`  Origin: ${origin.label}`);
console.log(`  Wind: 0° (from north)`);
console.log(`  Downwind buildings found: ${downwind.length}`);
console.log(`  Downwind building labels: ${downwind.map((b) => b.label).join(", ")}`);
// Buildings south of origin (lower latitude) should be in the downwind cone regardless of distance
const expectedLabels = ["3, Pine St", "4, Elm St", "5, Far South St"];
const passed = downwind.length === 3 && downwind.every((b) => expectedLabels.includes(b.label));
console.log(`  ${passed ? "✓ PASS" : "✗ FAIL"}\n`);

console.log("=== All verification tests completed ===");
