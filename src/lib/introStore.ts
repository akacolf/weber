import { Store } from "@tanstack/store";

export interface IntroState {
  hasPlayed: boolean;
}

const getInitialHasPlayed = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("replayIntro") === "true") {
      sessionStorage.removeItem("colf_keynote_intro_played");
      return false;
    }
    return sessionStorage.getItem("colf_keynote_intro_played") === "true";
  } catch {
    return false;
  }
};

export const introStore = new Store<IntroState>({
  hasPlayed: false,
});

// Sync on client side
if (typeof window !== "undefined") {
  introStore.setState((state) => ({
    ...state,
    hasPlayed: getInitialHasPlayed(),
  }));
}

export const markIntroAsPlayed = () => {
  introStore.setState((state) => ({
    ...state,
    hasPlayed: true,
  }));
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("colf_keynote_intro_played", "true");
    } catch {
      // Ignore storage errors in restricted environments
    }
  }
};
