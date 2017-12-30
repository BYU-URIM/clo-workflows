import { IRole } from "./../model/Role"
/**
 * TODO:
 * - add correct data, put in a store
 * - ask connor where we will access this from sharepoint
 */
export const roleData: Array<IRole> = [{
  name: "Anonymous",
  permittedSteps: [{
          name: "Public Domain Approval",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  }],
},
      {
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  }],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  }],
}],
},
{
  name: "Administrator",
  permittedSteps: [{
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  }],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  }],
}],
},
{
  name: "Admin Assistant",
  permittedSteps: [{
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  }],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  }],
} ],
},
{
  name: "Junior License Processor",
  permittedSteps: [{
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  } ],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  }],
}],
},
{
  name: "Senior License Processor",
  permittedSteps: [{
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  }],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  }],
}],
},
{
  name: "Supervisor",
  permittedSteps: [{
          name: "Intake",
          processFormControls: [{
              displayName: "control1 display name",
              modelRef: "control1 model ref",
              type: "text",
  } ],
},
      {
          name: "Public Domain Research",
          processFormControls: [{
              displayName: "control2 display name",
              modelRef: "control2 model ref",
              type: "text",
  } ],
} ],
} ]
