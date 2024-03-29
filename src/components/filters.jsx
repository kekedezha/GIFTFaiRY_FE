import React, { useState, useEffect } from "react";
import axios from "axios";
import ParameterComponent from "./parameterComponent";
import data from "/filters.json";
import NavBar from "./navbar";
import ProgressBar from "react-bootstrap/ProgressBar";
import { RingLoader } from "react-spinners";
import TypeWriter from "./typewriter";
import UserAuthentication from "./userAuthentication";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProductCarousel from "./productCarousel";

const Filters = ({ handleUserLogin, authentication }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relationship, setRelationship] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [occasion, setOccasion] = useState("");
  const [giftType, setGiftType] = useState([]);
  const [interests, setInterests] = useState([]);
  const [activity, setActivity] = useState("");
  const [personality, setPersonality] = useState("");
  const [gifteeName, setGifteeName] = useState("No name selected");
  const [nature, setNature] = useState("");
  const [activeElement, setActiveElement] = useState("gifteeName"); //Start at gifteeName page/state
  const [isGenerated, setIsGenerated] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [itemTitle, setItemTitle] = useState([]);
  const [itemDescrip, setItemDescrip] = useState([]);
  const [openaiDescrip, setOpenaiDescrip] = useState([]);
  const [progress, setProgress] = useState(0);
  const [promptMess, setPromptMess] = useState("");
  const [selectionMade, setSelectionMade] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSelections, setHasSelections] = useState(false);
  const [authCurrentUser, setAuthCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const handlePost = () => {
    setIsLoading(true);
    setIsGenerated(false);
    axios
      .post("https://giftfairy-be-server.onrender.com/api/filter/generate", {
        age: age,
        gender: gender,
        relationship: relationship,
        price_range: priceRange,
        occasion: occasion,
        gift_type: giftType.join(", "),
        interest: interests.join(", "),
        activity_level: activity,
        personality: personality,
        nature: nature,
        email: userEmail,
        giftee_name: gifteeName,
      })
      .then((response) => {
        setIsLoading(false);
        console.log("Response from backend:", response.data);
        //Toggle boolean value to true for re-generate button use
        setIsGenerated(true);
        //Reset the arrays on the front-end
        setItemDescrip([]);
        setItemTitle([]);
        setOpenaiDescrip([]);
        //Clear prompt message before items are done being generated.
        setPromptMess("");
        //Set response.data.item_descrip_string
        setItemDescrip(response.data.item_descrip_string.split("*"));
        //Set response.data.item_title_string
        setItemTitle(response.data.item_title_string.split(","));
        //Set response.data.openai_descrip_string
        setOpenaiDescrip(response.data.openai_descrip_string.split(","));
        //Set up variable to hold next prompt message depending on next active element
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error(
            "Server responded with status code:",
            error.response.data
          );
          if (error.response.status == 400) {
            alert(
              "You left one or more of your choices blank please go back and redo your selections!"
            );
          } else if (error.response.status == 404) {
            alert(
              "Back-End server endpoint not found. Server might have been discontinued."
            );
          } else if (error.response.status == 500) {
            alert("Internal Server Error, please try again!");
          } else if (error.response.status == 502) {
            alert("Bad Gateway, please try again!");
          } else if (error.response.status == 504) {
            alert("Gateway Timeout, please try again!");
          }
        } else if (error.request) {
          // The request was made but no response was received
          alert("No response received from server, please try again!");
        } else {
          // Something else happened while setting up the request
          alert("Error:", error.message);
        }
      });
  };

  const handleAgeChange = (selectedAge) => {
    setAge(selectedAge);
    console.log(selectedAge);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    console.log(selectedGender);
  };

  const handleRelationshipChange = (selectedRelationship) => {
    setRelationship(selectedRelationship);
    console.log(selectedRelationship);
  };

  const handlePriceRangeChange = (selectedPriceRange) => {
    setPriceRange(selectedPriceRange);
    console.log(selectedPriceRange);
  };

  const handleOccasionChange = (selectedOccasion) => {
    setOccasion(selectedOccasion);
    console.log(selectedOccasion);
  };

  const handleGiftTypeChange = (selectedGiftType) => {
    const containsGift = giftType.includes(selectedGiftType);
    if (containsGift) {
      setGiftType((prevArray) =>
        prevArray.filter((element) => element !== selectedGiftType)
      );
    } else {
      setGiftType([...giftType, selectedGiftType]);
    }
    console.log(giftType);
  };

  const handleInterestsChange = (selectedInterests) => {
    const containsInterests = interests.includes(selectedInterests);
    if (containsInterests) {
      setInterests((prevArray) =>
        prevArray.filter((element) => element !== selectedInterests)
      );
    } else {
      setInterests([...interests, selectedInterests]);
    }
    console.log(interests);
  };

  const handleActivityChange = (selectedActivity) => {
    setActivity(selectedActivity);
    console.log(selectedActivity);
  };

  const handlePersonalityChange = (selectedPersonality) => {
    setPersonality(selectedPersonality);
    console.log(selectedPersonality);
  };

  const handleNatureChange = (selectedNature) => {
    setNature(selectedNature);
    console.log(selectedNature);
  };

  const handleGifteeName = (selectedGifteeName) => {
    setGifteeName(selectedGifteeName);
    console.log(selectedGifteeName);
  };

  const handleGenerate = (selectedGenerate) => {
    setGenerate(selectedGenerate);
  };

  const progressValues = {
    gifteeName: 0,
    gender: 9,
    age: 19,
    relationship: 30,
    priceRange: 38,
    occasion: 46,
    giftType: 54,
    interests: 63,
    activity: 72,
    personality: 81,
    nature: 90,
    generate: 100,
  };

  //Object containing messages for each selection page
  const promptMessages = {
    gifteeName:
      "Beefore we get started, I'm curious, what is your giftee's name?",
    gender: "What is their gender?",
    age: "How old are they?",
    relationship: "What is your relationship with them?",
    priceRange: "What is your price range?",
    occasion: "What's the occasion?",
    giftType: "What gifts would they be interested in?",
    interests: "What are their interests?",
    activity: "What is their activity level?",
    personality: "What is their personality type?",
    nature: "Do they prefer being inside or outside?",
    generate: "",
  };

  const handleStateSet = (key, value) => {
    if (key === "Giftee Name") {
      handleGifteeName(value);
      setSelectionMade(true);
    }
    if (key === "Gender") {
      handleGenderChange(value);
      setSelectionMade(true);
    }
    if (key === "Age") {
      handleAgeChange(value);
      setSelectionMade(true);
    }
    if (key === "Relationship") {
      handleRelationshipChange(value);
      setSelectionMade(true);
    }
    if (key === "Price Range") {
      handlePriceRangeChange(value);
      setSelectionMade(true);
    }
    if (key === "Occasion") {
      handleOccasionChange(value);
      setSelectionMade(true);
    }
    if (key === "Gift Type") {
      handleGiftTypeChange(value);
      setSelectionMade(true);
    }
    if (key === "Interests") {
      handleInterestsChange(value);
      setSelectionMade(true);
    }
    if (key === "Activity Level") {
      handleActivityChange(value);
      setSelectionMade(true);
    }
    if (key === "Personality") {
      handlePersonalityChange(value);
      setSelectionMade(true);
    }
    if (key === "Nature") {
      handleNatureChange(value);
      setSelectionMade(true);
    }
    if (key === "generateButton") {
      handleGenerate(value);
      setSelectionMade(true);
    }
  };

  const handlePreviousElement = () => {
    // Define the mapping of previous states here
    const previousStateMap = {
      gender: "gifteeName",
      age: "gender",
      relationship: "age",
      priceRange: "relationship",
      occasion: "priceRange",
      giftType: "occasion",
      interests: "giftType",
      activity: "interests",
      personality: "activity",
      nature: "personality",
      generate: "nature",
    };

    if (activeElement !== "gifteeName" && previousStateMap[activeElement]) {
      const previousElement = previousStateMap[activeElement];
      setActiveElement(previousElement);
      if (previousElement === "gifteeName") {
        setSelectionMade(true);
      }
    }
    console.log(selectionMade);
  };

  const handleNextElement = () => {
    // Define the mapping of next states here
    const nextStateMap = {
      gifteeName: "gender",
      gender: "age",
      age: "relationship",
      relationship: "priceRange",
      priceRange: "occasion",
      occasion: "giftType",
      giftType: "interests",
      interests: "activity",
      activity: "personality",
      personality: "nature",
      nature: "generate",
    };

    if (activeElement !== "generate" && nextStateMap[activeElement]) {
      const nextElement = nextStateMap[activeElement];
      setActiveElement(nextElement);
      const newProgress = progressValues[nextElement];
      setProgress(newProgress);
      const newPrompt = promptMessages[nextElement];
      setPromptMess(newPrompt);
      setSelectionMade(false);
    }
    console.log(selectionMade);
  };

  //Filters.jsx - User Authentication Observer
  //The observer tracks the user authentication token across the different components

  console.log("Auth Current User is: " + authCurrentUser);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setAuthCurrentUser(user);
        console.log("User is: " + user);
        setUserEmail(user.email);
        handleUserLogin(user); // Call the handler to update user state in parent component
      } else {
        // No user is signed in
        setAuthCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the observer
  }, []);

  console.log(authCurrentUser);

  return (
    <>
      <div className="navbar-ProgressBar-Container">
        <NavBar />
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 80 1440 200">
        <path
          fill="#ffa517"
          fillOpacity=".75"
          d="M0,160L40,176C80,192,160,224,240,234.7C320,245,400,235,480,197.3C560,160,640,96,720,96C800,96,880,160,960,165.3C1040,171,1120,117,1200,85.3C1280,53,1360,43,1400,37.3L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
        ></path>
      </svg>

      <br />

      {/* While going through selections and before making it to the generate page, show this 
      version of the "prompt-div" div */}
      {activeElement !== "generate" && (
        <div className="prompt-div">
          {/* Christian Dezha - 12/12/2023 */}
          <TypeWriter text={promptMessages[activeElement]} />
          {activeElement !== "generate" && activeElement !== "gifteeName" ? (
            activeElement !== "giftType" && activeElement !== "interests" ? (
              <p>(Select One Option)</p>
            ) : (
              <p>(Select Multiple Options)</p>
            )
          ) : (
            <p>(Optional)</p>
          )}
        </div>
      )}

      {activeElement == "generate" && authCurrentUser && !isGenerated && (
        <div className="prompt-div">
          {!isLoading && (
            <p className="openaiDescrip">
              {gifteeName === "No name selected"
                ? `Press 'Generate' to see 10 gift ideas that I think your giftee would love!`
                : `Press 'Generate' to see 10 gift ideas that I think ${gifteeName} would love!`}
            </p>
          )}
          {isLoading ? (
            <RingLoader color="black" />
          ) : (
            <TypeWriter text={promptMessages[activeElement]} />
          )}
        </div>
      )}

      <div className="paramCompContainer">
        <ParameterComponent
          key={activeElement}
          data={data[activeElement]}
          handler={handleStateSet}
          hasSelectionsHandler={setHasSelections}
        />
      </div>

      {isGenerated && (
        <>
          <div className="container">
            <ProductCarousel itemTitle={itemTitle} itemDescrip={itemDescrip} />
          </div>
        </>
      )}

      {/* Regenerate Button */}
      {isGenerated && (
        <div className="regenButton-div">
          <button onClick={handlePost}>Re-Generate</button>
        </div>
      )}

      {activeElement === "generate" &&
        !isLoading &&
        !isGenerated &&
        authCurrentUser && (
          <button
            onClick={handlePost}
            disabled={isLoading}
            className={`generateButton ${isLoading ? "opacity1" : "opacity2"}`}
          >
            Generate
          </button>
        )}

      {activeElement === "generate" &&
        !isLoading &&
        !isGenerated &&
        !authCurrentUser && (
          <>
            <div className="prompt-div">
              <TypeWriter
                text={
                  "Before I can give you any suggestions, please login or register a new account!"
                }
              />
            </div>
            <UserAuthentication
              handleUserLogin={handleUserLogin}
              authentication={authentication}
            />
          </>
        )}

      <div className="footer">
        {!isGenerated && (
          <>
            <div className="backButton-div">
              {activeElement !== "gifteeName" && (
                <button
                  onClick={handlePreviousElement}
                  disabled={isLoading}
                  className={`backButton ${
                    isLoading ? "opacity1" : "opacity2"
                  }`}
                >
                  Previous
                </button>
              )}
            </div>

            {/* Next Button Logic for Single Selections */}
            <div className="nextButton-div">
              {(activeElement == "age" ||
                activeElement == "gender" ||
                activeElement == "activity" ||
                activeElement == "personality" ||
                activeElement == "nature" ||
                activeElement == "priceRange" ||
                activeElement == "relationship") && (
                <button
                  disabled={!selectionMade}
                  onClick={handleNextElement}
                  className={`${selectionMade ? "opacity2" : "opacity1"}`}
                >
                  Next
                </button>
              )}

              {/* Next Button Logic for Multi Selections */}
              {(activeElement == "giftType" ||
                activeElement == "interests" ||
                activeElement == "occasion") && (
                <button
                  disabled={!hasSelections || !selectionMade}
                  onClick={handleNextElement}
                  className={`${
                    hasSelections && selectionMade ? "opacity2" : "opacity1"
                  }`}
                >
                  Next
                </button>
              )}

              {/* Next button logic for 'Optional' gifteeName */}
              {activeElement == "gifteeName" && (
                <button
                  onClick={handleNextElement}
                  className={`${selectionMade}`}
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <ProgressBar
        now={progressValues[activeElement]}
        label={``}
        style={{
          backgroundColor: "white",
          width: "100%",
          opacity: ".75",
          height: "8px",
        }}
      >
        <ProgressBar
          variant="success"
          now={progressValues[activeElement]}
          label={``}
          style={{ background: "#ffa514", height: "8px" }}
        />
      </ProgressBar>
    </>
  );
};

export default Filters;
