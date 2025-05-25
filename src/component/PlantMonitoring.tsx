import { useEffect, useState } from "react";
import { database, db } from "../firebase";
import { onValue, ref, update } from "firebase/database";
import OpenAI from "openai";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { CheckCircle, Eye } from "lucide-react";

const PlantMonitoring = () => {
  const [selectedValue, setSelectedValue] = useState("none");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sensorReadings, setSensorReadings] = useState<any>({
    detection: "none",
  });

  const [plantsDetected, setPlantsDetected] = useState<any[]>([]);
  const [detectionData, setDetectionData] = useState<any[]>([]);

  const [detections, setDetections] = useState("detect");

  const [plantIndex, setPlantIndex] = useState(0);

  const [analysisData, setAnalysisData] = useState<any>({});
  const [moisture, setMoisture] = useState(0);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [checkButton, setCheckButton] = useState(false);

  const [plantFilter, setPlantFilter] = useState("all");

  const fetchAiResponse = async (input: string) => {
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the plant if its Pechay, Lettuce, Tomato, or Onion-leaves also note that all plants that you are scanning are on the 4 listed plants so just classify it, Identify if there are pests and diseases then recommend a pesticide just say there's is no diseases/pest if there's none. response format Plant:[name with bracket] Disease/Pest:[list the disease inside the bracket just output none if there's none] Pesticide:[inside this bracket]",
              },
              {
                type: "image_url",
                image_url: {
                  url: input,
                },
              },
            ],
          },
        ],
      });
      console.log(completion.choices[0].message.content);
      setAiResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching aiResponse:", error);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // This converts the blob to base64
    });
  };

  const captureImage = async (): Promise<string | null> => {
    try {
      // Fetch the image from the backend "http://172.20.10.3:5000/video_feed
      const response = await fetch("http://172.20.10.3:5000//capture_image");

      console.log(response);

      if (response.status !== 200) {
        return null;
      }

      const blob = await response.blob();

      const base64 = await convertBlobToBase64(blob);

      return base64;
    } catch (error) {
      console.error("Error capturing image:", error);
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    // Replace "your_data_path/specific_document_id" with the path to your single document
    const documentRef = ref(database, "users");

    const unsubscribe = onValue(documentRef, (snapshot) => {
      const documentData = snapshot.val();
      if (documentData) {
        setSensorReadings({ id: snapshot.key!, ...documentData });
        console.log(sensorReadings);
      } else {
        setSensorReadings({}); // Handle case where the document doesn't exist
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, "plantData");

    // Setup the collection snapshot listener
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const docsData: any[] = [];
        querySnapshot.forEach((doc) => {
          docsData.push({ ...doc.data(), id: doc.id }); // Extract document data
        });
        setPlantsDetected(docsData);
        setSelectedValue(docsData[docsData.length - 1].id);
        setPlantIndex(docsData.length);
      },
      (error) => {
        console.error("Error fetching collection data:", error);
      }
    );

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, `plantData/${selectedValue}/data`);

    // Setup the collection snapshot listener
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const docsData: any[] = [];
        querySnapshot.forEach((doc) => {
          docsData.push({ ...doc.data(), id: doc.id }); // Extract document data
        });
        setDetectionData(docsData);
      },
      (error) => {
        console.error("Error fetching collection data:", error);
      }
    );

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, [selectedValue]);

  const getCustomFormattedDateTime = () => {
    const currentDate = new Date();

    // Custom format (example: "2025-01-20 12:34:56")
    const customFormattedDateTime =
      currentDate
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(",", "")
        .replace("/", "-")
        .replace("/", "-") +
      currentDate
        .toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(",", "");

    return customFormattedDateTime;
  };

  const handleAddData = async (data: any, col: string) => {
    try {
      // Specify the collection reference
      const collectionRef = collection(db, col);

      // Add data to the collection
      const docRef = await addDoc(collectionRef, data);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleAddDataWithId = async (data: any, col: string, id: string) => {
    try {
      // Specify the collection reference
      const collectionRef = collection(db, col);

      // Add data to the collection
      const docRef = doc(collectionRef, id);
      await setDoc(docRef, data);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  useEffect(() => {
    if (detections === "detect" && selectedValue !== "none" && checkButton) {
      if (aiResponse) {
        const regex = /\[([^\]]+)\]/g; // Match text inside square brackets
        const matches = Array.from(aiResponse.matchAll(regex)).map(
          (match) => match[1]
        );

        const code = Math.floor(100000 + Math.random() * 900000);

        const plantData = {
          Plant: matches[0],
          Disease: matches[1],
          Pesticide: matches[2],
          moisture: sensorReadings.moisture,
          nitrogen: sensorReadings.nitrogen,
          phosphorus: sensorReadings.phosphorus,
          potassium: sensorReadings.potassium,
        };
        setAnalysisData(plantData);
        handleAddDataWithId(
          plantData,
          `plantData/${selectedValue}/data`,
          getCustomFormattedDateTime()
        );
        setCheckButton(false);
        updateDocument("plant_to_detect", { detect: 0, name: matches[0] });
        updatePlantDocument("plantData", selectedValue, {
          name: matches[0],
          disease: matches[1],
          customID: matches[0] + code,
        });
        updateDocument("users", { detection: "none" });
      }
    } else if (detections === "detect") {
      setMoisture(sensorReadings.moisture);
      if (aiResponse) {
        const regex = /\[([^\]]+)\]/g; // Match text inside square brackets
        const matches = Array.from(aiResponse.matchAll(regex)).map(
          (match) => match[1]
        );

        const plantData = {
          Plant: matches[0],
          Disease: matches[1],
          Pesticide: matches[2],
          moisture: sensorReadings.moisture,
          nitrogen: sensorReadings.nitrogen,
          phosphorus: sensorReadings.phosphorus,
          potassium: sensorReadings.potassium,
        };

        const code = Math.floor(100000 + Math.random() * 900000);

        setAnalysisData(plantData);
        const id = getCustomFormattedDateTime();
        handleAddDataWithId(
          {
            name: matches[0],
            disease: matches[1],
            customID: matches[0] + code,
          },
          "plantData/",
          id
        );

        handleAddDataWithId(
          plantData,
          `plantData/${getCustomFormattedDateTime()}/data`,
          id
        );
        updateDocument("users", { detection: "none" });
        updateDocument("plant_to_detect", { name: matches[0] });
      }
    }

    setAiResponse(null);
    setLoadingAnalysis(false);
  }, [aiResponse]);

  const handleCapture = async () => {
    const url = await captureImage();
    if (url) {
      setLoadingAnalysis(true);
      fetchAiResponse(url);
    }
    if (url === null) {
      setAiResponse("Plant:[Error] Disease/Pest:[Error] Pesticide:[Error]");
      console.log("Failed to capture the image.");
    }
  };

  const updatePlantDocument = async (
    collectionName: string,
    docId: string,
    updatedData: Record<string, any>
  ): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, updatedData);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  };

  const updateDocument = async (
    path: string,
    data: Record<string, any>
  ): Promise<void> => {
    try {
      const docRef = ref(database, path); // Reference to the document
      await update(docRef, data); // Update the document
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    console.log(sensorReadings);
    if (sensorReadings.detection !== "none") {
      handleCapture();
    }
  }, [sensorReadings]);

  const getFilteredPlants = () => {
    if (plantFilter === "all") return plantsDetected;

    return plantsDetected.filter((plant) => {
      if (plantFilter === "healthy") {
        return plant.disease === "none";
      }

      if (plantFilter === "unhealthy") {
        return plant.disease !== "none";
      }

      return true;
    });
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col">
      {/* Main content */}
      <div className="container mx-auto p-6 flex flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Live Camera Feed */}
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-700 text-white font-semibold flex items-center justify-between">
              <span className="flex items-center">
                <Eye className="mr-2" /> Live Camera Feed
              </span>
              <span className="bg-red-500 px-2 py-1 rounded-full text-xs animate-pulse">
                LIVE
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-900 w-full h-70">
              <div className="relative h-full w-full rounded overflow-hidden">
                <img
                  src="http://172.20.10.3:5000/video_feed"
                  alt="Plant camera feed"
                  className="w-full h-full object-cover rotate-90"
                />
                {loadingAnalysis && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-white font-medium">
                      Analyzing plant health...
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-800">
              <div className="flex gap-3">
                <select
                  value={selectedValue}
                  disabled={checkButton}
                  onChange={(e) => {
                    setSelectedValue(e.target.value);
                    setPlantIndex(e.target.selectedIndex);
                    console.log(e.target.value);
                  }}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="" disabled selected>
                    Select Plant to Analyze
                  </option>
                  {getFilteredPlants().map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.customID}
                    </option>
                  ))}
                </select>

                <select
                  value={plantFilter}
                  disabled={checkButton}
                  onChange={(e) => {
                    setPlantFilter(e.target.value);
                  }}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All</option>
                  <option value="healthy">Healthy</option>
                  <option value="unhealthy">Unhealthy</option>
                </select>
              </div>
              <button
                onClick={() => {
                  updateDocument("plant_to_detect", { detect: plantIndex });
                  setCheckButton(true);
                }}
                disabled={checkButton}
                className={`mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                  checkButton
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }`}
              >
                <CheckCircle className="mr-2" /> Analyze Selected Plant
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-700 text-white font-semibold">
              Current Analysis Results
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col">
                <div className="mb-6 bg-slate-700 rounded-lg p-4">
                  <h3 className="text-green-400 text-lg font-semibold mb-2">
                    Plant Information
                  </h3>
                  <div className="flex items-center justify-between py-2 border-b border-slate-600">
                    <span className="text-slate-400">Species:</span>
                    <span className="text-white font-medium">
                      {analysisData.Plant}
                    </span>
                  </div>
                </div>

                <div className="mb-6 bg-slate-700 rounded-lg p-4">
                  <h3 className="text-yellow-400 text-lg font-semibold mb-2">
                    Health Status
                  </h3>
                  <div className="flex items-center justify-between py-2 border-b border-slate-600">
                    <span className="text-slate-400">Condition:</span>
                    <span
                      className={`font-medium ${
                        analysisData.Disease === "Healthy"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysisData.Disease}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-600">
                    <span className="text-slate-400">Treatment:</span>
                    <span className="text-white font-medium">
                      {analysisData.Pesticide}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-blue-400 text-lg font-semibold mb-2">
                    Soil Conditions
                  </h3>
                  <div className="flex flex-col  *:first-letter: py-2 border-b border-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Moisture:</span>
                      <span className="text-white font-medium">
                        {analysisData.moisture}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nitrogen:</span>
                      <span className="text-white font-medium">
                        {analysisData.nitrogen}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phosphorus:</span>
                      <span className="text-white font-medium">
                        {analysisData.phosphorus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Potassium:</span>
                      <span className="text-white font-medium">
                        {analysisData.potassium}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History & Records */}
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-700 text-white font-semibold">
              Analysis History
            </div>
            <div className="flex-1 overflow-y-auto">
              {detectionData.length > 0 ? (
                detectionData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setAnalysisData(item)}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer ${
                      item.id === analysisData.id ? "bg-slate-700" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{item.id}</h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          item.Disease === "Healthy"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {item.Disease}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Plant: {item.Plant}
                    </p>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Treatment: {item.Pesticide}</span>
                      <span>{item.moisture.split(" ")[0]}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">
                  No analysis records found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-slate-500 text-sm">
        AI-One: Greenhouse Management System &copy; 2025 | Thesis Project
      </footer>
    </div>
  );
};

export default PlantMonitoring;
