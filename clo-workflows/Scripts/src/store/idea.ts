// @ts-nocheck
export class StepManager {
  status: "none" | "started" | "done"
  currentStep: number
  steps: Array<UIStep>
  nextStep(): void {
    this.currentStep! > this.steps.length ? (this.currentStep += 1) : (this.status = "done")
  }
}
export interface IStepInfo {
  name: string
}
export interface IUIStep {
  id: string
  nextStepId?: string
  stepInfo: IStepInfo
}

// tslint:disable-next-line:max-classes-per-file
export class UIStep implements IUIStep {
  id: string
  nextStepId?: string
  stepInfo: IStepInfo
}

const stepManager = new StepManager()
stepManager.currentStep = 0
stepManager.status = "started"
stepManager.steps = [
  {
    id: "zero",
    nextStepId: "one",
    stepInfo: {
      name: "add project",
    },
  },
  {
    id: "one",
    nextStepId: "two",
    stepInfo: {
      name: "add work",
    },
  },
  {
    id: "two",
    nextStepId: "three",
    stepInfo: {
      name: "add the rest",
    },
  },
  {
    id: "three",
    stepInfo:{
      name: "another one"
    }
  },
]

console.log(`
    step: ${stepManager.steps[stepManager.currentStep].id}
  status: ${stepManager.status}`)
stepManager.nextStep()
console.log(`
    step: ${stepManager.steps[stepManager.currentStep].id}
  status: ${stepManager.status}`)
stepManager.nextStep()
console.log(`
    step: ${stepManager.steps[stepManager.currentStep].id}
  status: ${stepManager.status}`)
stepManager.nextStep()
console.log(`
    step: ${stepManager.steps[stepManager.currentStep].id}
  status: ${stepManager.status}`)
