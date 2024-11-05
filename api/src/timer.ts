export enum PomodoroStage {
  Focus = "focus",
  Break = "break",
  None = "none"
}

export class Timer {
  private timeElapsed = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private currentStage = PomodoroStage.None;

  private start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.timeElapsed += 1;
    }, 1000);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  status() {
    return {
      timeElapsed: this.timeElapsed,
      currentStage: this.currentStage
    };
  }

  private reset() {
    this.pause();
    this.timeElapsed = 0;
    this.currentStage = PomodoroStage.None;
  }

  private restart() {
    this.reset();
    this.start();
  }

  focus() {
    this.currentStage = PomodoroStage.Focus;
    this.restart();
  }

  break() {
    this.currentStage = PomodoroStage.Break;
    this.restart();
  }

  private checkForReset() {
    const timeElapsedInMinutes = this.timeElapsed / 60;
    const focusTimeInMinutes = 50;
    const breakTimeInMinutes = 5;

    if (
      this.currentStage === PomodoroStage.Focus &&
      timeElapsedInMinutes >= focusTimeInMinutes
    ) {
      this.reset();
    } else if (
      this.currentStage === PomodoroStage.Break &&
      timeElapsedInMinutes >= breakTimeInMinutes
    ) {
      this.reset();
    }
  }

  update() {
    this.checkForReset();
  }
}