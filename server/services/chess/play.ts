import axios from "axios";

export const createChallenge = async (userToken: string) => {
  try {
    const response = await axios.post(
      "https://lichess.org/api/challenge/open",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        rated: false,
        clock: {
          limit: 300,
          increment: 0,
        },
        days: 2,
        variant: "standard",
        name: "MyChallenge",
        users: "",
      }
    );

    const challengeId = response.data.challenge.id;
    const challengeUrl = `https://lichess.org/${challengeId}`;

    console.log(`Challenge created: ${challengeUrl}`);

    return challengeId;
  } catch (error) {
    console.error(error);
  }
};

const playGame = async (challengeId: string, userToken: string) => {
  try {
    const gameUrl = `https://lichess.org/${challengeId}`;
    console.log(`Playing game: ${gameUrl}`);

    // Start the clocks
    await axios.post(
      `https://lichess.org/api/board/game/${challengeId}/startClocks`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Make a move
    const response = await axios.post(
      `https://lichess.org/api/board/game/${challengeId}/move`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        move: "e2e4",
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const newGame = async (userToken: string) => {
  const challengeId = await createChallenge(userToken);
  return await playGame(challengeId, userToken);
};

export default newGame;
