# clo-workflows
This app handles copyright request intake and management for the Copyright Liscensing Office. It is built with React, Typescript, and Mobx.

## Architecture
block diagram of major components:
![clo-workflows architecture - page 1](https://user-images.githubusercontent.com/19392776/37235376-5c7164b4-23bb-11e8-99f5-9fd256dfde96.png)
  ### Stores
   App data is managed through Mobx stores. Make sure to read Mobx documentation and tutorials before contributing to this app.
   Each store contains the data and business logic for a sub domain of the app data (i.e Requests, Session, etc...). 
   Stores communicate directly with services (send / recieve data) and indirectly with react components (cause re-renders when observable data changes).
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
   Because the stores are dependendent only on the IDataService interface (and not an implementation of it), different data sources can be used for development (MockDataService) and production (SpDataService).
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
   Dumb components (or simply components) are not aware of any app state outside of the props they recieve.
   All they know how to do is accept a piece of app state and render it to JSX.
   They can mutate stores indirectly through action callbacks passed to them as props.
   Dumb components should perform minimal logic on the props they receive, as they are mostly concerned with rendering views.
   Ideally, dumb components should be pure functional react components:
   ```
   Component = props => (
      <jsx ... />
   )
   ```
   

## Business Logic - Request Elements
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
  A work contians all relevant metadata about about the requested song, dance, movie, etc.
  Clients may input a new work during request intake or they may reference a previously submitted work.
  All work fields are found here: https://docs.google.com/spreadsheets/d/1vGkzYIOZE2k62cmGciDJA8EsEgI82pr6CrJGi5aX0L4/edit?usp=sharing
