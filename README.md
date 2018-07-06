# clo-workflows

- [clo-workflows](#clo-workflows)
    - [Architecture](#architecture)
        - [Stores](#stores)
        - [Data Service](#data-service)
        - [JSON Resources](#json-resources)
        - [Smart Components / Layouts](#smart-components---layouts)
        - [Dumb Components](#dumb-components)
    - [Model - Request Elements](#model---request-elements)
        - [Projects](#projects)
        - [Processes](#processes)
        - [Works](#works)
    - [Build System](#build-system)
        - [Production Build](#production-build)
        - [Local Build](#local-build)
        - [SharePoint Build](#sharepoint-build)
        - [SharePoint Proxy Build](#sharepoint-proxy-build)
    - [Migrations](#migrations)
    - [Common Tasks](#common-tasks)
        - [First Time Setup](#first-time-setup)
        - [Creating / Editing Fields](#creating---editing-fields)
        - [Creating / Editing Views](#creating---editing-views)
        - [Creating / Editing Roles](#creating---editing-roles)
    - [Res Folder](#res-folder)
        - [index.html](#indexhtml)
        - [types_res.d.ts](#types-resdts)
        - [FORM_CONTROLS.json](#form-controlsjson)
        - [VIEWS.json](#viewsjson)
        - [PROCESS_STEPS.json](#process-stepsjson)
        - [USER_ROLES.json](#user-rolesjson)

This app handles copyright request intake and management for the Copyright Licensing Office. It is built with React, Typescript, and Mobx.

## Architecture

block diagram of major components:
![clo-workflows architecture - page 1](https://user-images.githubusercontent.com/19392776/37235376-5c7164b4-23bb-11e8-99f5-9fd256dfde96.png)

### Stores

App data is managed through Mobx stores. Make sure to read Mobx documentation and tutorials before contributing to this app.
Each store contains the data and business logic for a sub domain of the app data (i.e Requests, Session, etc...).
Stores communicate directly with services (send / receive data) and indirectly with react components (cause re-renders when observable data changes).
Store data can only be mutated through class methods marked as Mobx @actions.

**Client Store** is only created if the current user is anonymous (non-employee).
This store holds all in active projects and processes that the current user has submitted.
The client store manages the view state necessary for displaying active projects and manages the intake of new projects.

**Employee Store** is only created if the current user is a member of a CLO Employee SharePoint group.
This store holds all active projects and processes that are currently in processing steps which are viewable by the current user's role.
The employee store manages the view state necessary for displaying an "employee dashboard" (active processes grouped by roles).
It also contains view state for displaying an individual process detail.

**Session Store** holds information about the current user.

**Root Store** contains references to each child store, and passes a reference to itself to each child store so that any child store can reference any other child store.
The root store adds no other functionality to the app.

### Data Service

The data service exposes CRUD operations for current and past projects, processes, works, and notes that are stored in the database.
In code, the data service is defined by the IDataService interface and implemented by the SpDataService and the MockDataService.
Because the stores are dependent only on the IDataService interface (and not an implementation of it), different data sources can be used for development (MockDataService) and production (SpDataService).
The DataServiceFactory contains logic for matching up environments (dev / production) to data service implementations, thus only the DataServiceFactory should instantiate the data service.

### JSON Resources

JSON configuration files define instances of roles, steps, views, and form controls.
These instances determine how a request is processed (steps), by who it is processed (roles), and how it is presented (views and form controls).
The decision was made to store these configurations as JSON resources for extensibility purposes.
If someone wants to change how the data is processed or presented, they only need to change a JSON text file - no code needed.

### Smart Components / Layouts

Layouts, or smart components, are aware of app state because they are injected with store references.
They are observers to observable store data and will re-render when that data changes.
They can also mutate stores based on user input.
Smart components render dumb components and pass them any applicable app state.
These components are full React stateful components:

```
class Layout extends React.Component<any, any> { ... }
```

### Dumb Components

Dumb components (or simply components) are not aware of any app state outside of the props they receive.
All they know how to do is accept a piece of app state and render it to JSX.
They can mutate stores indirectly through action callbacks passed to them as props.
Dumb components should perform minimal logic on the props they receive, as they are mostly concerned with rendering views.
Ideally, dumb components should be pure functional react components:

```tsx
Component = props => (
   <jsx ... />
)
```

---

## Model - Request Elements

Each copyright licensing request is broken up into pieces to make it easier to manage.
These pieces are diagrammed and described below:
![clo workflows model - request elements](https://user-images.githubusercontent.com/19392776/37231219-9d97025a-23a7-11e8-95df-09b068c5780f.png)

### Projects

A Project contains all of the information for how a department plans to use the work(s) they request.
Clients input this information during request intake.
A Projects contains information such as venue, audience size, and number of showings.
You can think of it as an event for which one or many works may be requested.
All project fields are found here: https://docs.google.com/spreadsheets/d/12fGr_gjksTJAjtNUFMIAAQ1WF4ms45uasYCQOCO031w/edit?usp=sharing

### Processes

A Process represents the request to use a work within the context of a project.
Employees modify different parts of a process during the approval process.
A process is always paired with the work that is being requested (workId), and contains a reference to the project it will be used in (projectId).
There are also metadata fields corresponding to each step in the approval process, indicating whether or not a process has passed a given step.
As a process progresses, it becomes visible to different employees responsible for different approval steps.

### Works

A work contains all relevant metadata about about the requested song, dance, movie, etc.
Clients may input a new work during request intake or they may reference a previously submitted work.
All work fields are found here: https://docs.google.com/spreadsheets/d/1vGkzYIOZE2k62cmGciDJA8EsEgI82pr6CrJGi5aX0L4/edit?usp=sharing

---

## Build System

The build system is composed of several build scripts that allow you to target different environments and build types. All of these scripts are found in package.json.
To run any of the build scripts, use a terminal to navigate to `/clo-workflows/Scripts`. After entering the build command, the bundled app is stored in `/clo-workflows/dist/bundle.js`. Note that parts of the code are environment-dependent and will not work if they are being run against an environment different than their build environment.

**Dev vs Build**: each script is prefixed by either dev or build. Build signifies that the build script will run once, and dev signifies that it will run once and then watch for file changes to rebuild when necessary.

**Host URL**: Before running any of the builds that target a SharePoint environment (production, SharePoint, and SharePoint proxy), navigate to `clo-workflows/Scripts/res/json/DB_CONFIG` and make sure that the hostUrl property contains the url of the host site you are deploying against. This URL needs to be correct so that the app knows what site to query for process, project, and work lists. 

### Production Build

This build targets a SharePoint environment and utilizes Webpack's 'production mode' to optimize for production. For small changes to the code that will not require debugging, use this build in conjunction with the deploy steps to quickly update a production instance of the app.

```
npm run build:production
```

### Local Build

Local build targets a local dev environment. Instead of pulling data from a SharePoint server, it pulls mock data from `/clo-workflows/Scripts/src/service/dataService/MockData.ts`. During `dev:local`, the app is served up to localhost:8080.

```
npm run build:local
npm run dev:local
```

### SharePoint Build

SharePoint Build targets a SharePoint instance. It is identical to production build except that it does not contain production optimizations.

```
npm run build:sharepoint
npm run dev:sharepoint
```

### SharePoint Proxy Build

Sharepoint Proxy build mode targets a SharePoint instance, but is run locally for ease of testing. It does this by serving a SharePoint-targeted build to `localhost:8080`, and then routing all SharePoint API calls to a remote SharePoint instance. This way, you can locally test the app against the real SharePoint API and real SharePoint data.


The first time you run this build mode, you will be prompted for a url, username, and password. Your username and password should be your normal BYU login. The URL must be an **app instance URL** of a previously deployed sharepoint app, not a host URL. An example of an app instance URL is `https://sp13-c3d12ebd09d216.spapps.byu.edu/clo_workflows_dev/clo-workflows`. If want to change the URL that you gave in the prompt, update the file `clo-workflows/Scripts/sp_config/proxy-server/private.json`. This file is automatically created by the proxy server but can be updated manually at any time.

```
npm run dev:sharepointProxy
```

## Migrations

---

## Common Tasks

### First Time Setup

### Creating / Editing Fields

see for more info [Views](#FORM_CONTROLS.json)

1.  goto res/json/form_templates/FORM_CONTROLS.json
2.  add a new entry to the json, following the same schema as the other for controls
3.  use the properties "displayName", "dataRef", and "type"
4.  save and start using the new/updated field.

### Creating / Editing Views

see for more info [Views](#VIEWS.json)

1.  goto res/json/form_templates/VIEWS.json
2.  add a new entry to the json following the schema of the others
3.  use the fields "dataSource", "formControls", and "privilegedFormControls"
4.  save and start using the new view.

### Creating / Editing Roles

see for more info [Roles](#USER_ROLES.json)

roles are added to the groups section of DB_CONFIG

1.  goto res/json/form_templates/USER_ROLES.json
2.  add a new entry to the json following the schema of the others
3.  use the fields "name", "permittedSteps", and "rank"
4.  save and start using the new Role.

---

## Res Folder

The res folder holds the resources including:

### index.html

*   this is the template webpack uses to generate the base html page.

### types_res.d.ts

*   type definitions for the json files

### FORM_CONTROLS.json

*   This is the file that all form fields are defined in
*   If you want to add a new field to a form (meaning a field that doesn't already exist on another form), add it here.

```ts
    /* the name of the form control as a key */
    "ID": {
        /* the label of the field */
        "displayName": "ID",
        /* the name of the field on the SharePoint list, this maps to what's sent and received in requests to SharePoint */
        "dataRef": "Id",
        /* the type of data that the field accepts */
        "type": "number"
    },
```

*   the different types accepted are text, textarea, number, checkbox, and choice
*   if you use choice, add a choice property with an array of strings for the choices

```ts
    "Status": {
        "displayName": "Status",
        "dataRef": "status",
        "type": "choice",
        "choices": [
            "Active",
            "Canceled"
        ]
    }
```

### VIEWS.json

*   The Views file is used to compose forms out of form controls.
*   Any form in the site had a view defined here.

```ts
    /* the name the view as a key */
    "Website": {
        /* the type of data the form is associated with (works, processes, or projects ) */
        "dataSource": "works",
        /* the fields you want on the form (defined in FORM_CONTROLS.json ) */
        "formControls": [
            "Course",
            "Title",
            "Author",
            "Publisher",
            "Year Published",
            "URL",
            "Hard Copy Owner"
        ],
        /* the fields you want to be accessible only from the employee dashboard */
        "privilegedFormControls": [
            "Owner NetID"
        ]
    },
```

The views are pretty straight-foreword. Give it a name, the type of data (dataSource), the fields you want on it (formControls), and any privilegedFields for employee use only.

### PROCESS_STEPS.json

*   the various steps a process goes through are defined and configured here.
*   Note the order (orderId) of the steps are defined here
*   Note that there can be multiple "processFieldNames" if there are multiple results that come from the same step (i.e. "Process Payment" step)

```ts
    /* the name of the step as a key */
    "Public Domain Research": {
        /* name of the step */
        "name": "Public Domain Research",
        /* the order this step fits in with the other steps */
        "orderId": 1,
        /* the view/form associated with the step */
        "view": "Public Domain Research",
        /* the name of the field used to store the submitter name */
        "submitterFieldName": "publicDomainResearchSubName",
        /* the name of the field used to store the submission date */
        "submissionDateFieldName": "publicDomainResearchSubDate",
        /* the name of the field used to store the result of this step */
        "processFieldNames": [
            "publicDomainResearch"
        ]
    },
```

### USER_ROLES.json

User roles are the definitions for the different employee roles that exist. This is used to define what the roles are and which steps each role is allowed to access. New roles and updates to existing roles happen in this file.

Adding a new role requires adding the role to the DB_CONFIG groups section and running migrations

```ts
    /* the name of the role as a key*/
    "LTT Junior License Processor": {
        /* the name of the role */
        "name": "Junior License Processor",
        /* the steps they can access, found in PROCESS_STEPS.json */
        "permittedSteps": [
            "Existing License",
            "Ownership Research Licensing Exchange",
            "Request Submitted",
            "Response from Rights Holder Received",
            "Receipt of License",
            "Payment"
        ],
        /* the order number/rank of the step */
        "rank": 1
    },
```
