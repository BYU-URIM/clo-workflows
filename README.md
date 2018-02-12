# clo-workflows
This app handles copyright request intake and management for the Copyright Liscensing Office. It is built with React, Typescript, and Mobx.

## Architecture
block diagram of major components:
![clo-workflows architecture](https://user-images.githubusercontent.com/19392776/36082209-82501fc4-0f64-11e8-8235-0165667dd015.png)
  ### Stores
   App data is managed through Mobx stores. Make sure to read Mobx documentation and tutorials before contributing to this app.
   Each store contains the data and business logic for a sub domain of the app data (i.e Requests, Session, etc...). 
   Stores communicate directly with services (send / recieve data) and indirectly with react components (cause re-renders when observable data changes).
   Store data can only be mutated through class methods marked as Mobx @actions.
   The parent store contains references to each child store, and passes a reference to itself to each child store so that any child store can reference any other child store.
   The parent store adds no other functionality to the app.
   
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
   
