# clo-workflows
This app handles copyright request intake and management for the Copyright Liscensing Office. It is built with React, Typescript, and Mobx.

## Architecture
block diagram of major components:
![clo workflows architecture](https://user-images.githubusercontent.com/19392776/33511120-aee8f4e0-d6d2-11e7-9651-545f49b54476.png)
  ### Stores
   App data is managed through Mobx stores. Make sure to read Mobx documentation and tutorials before contributing to this app.
   Each store contains the data and business logic for a sub domain of the app data (i.e Requests, User, etc...). 
   Stores communicate directly with services (send / recieve data) and indirectly with smart react components (cause re-renders when observable data changes).
   Store data can only be mutated through class methods marked as Mobx @actions.
   The parent store contains references to each child store, and passes a reference to itself to each child store so that any child store can reference any other child store.
   The parent store adds no other functionality to the app.
   
   ### Async Service
   A functional layer dedicated to a persisting data to the server and fetching data from the server.
   This service does not directly perform REST calls, but passes calls through to the data access layer.
   As a high level persister abstraction, each function in this service may make several calls to various data access functions.
   
   ### Data Access
   A skinny functional layer composed of functions making REST calls to the SharePoint server.
   Each function in this layer concerns itself with only one task (makes a single REST call).
   
   ### Smart Components / Layouts
   Layouts, or smart components, are aware of app state because they are injected with store references.
   They are observers to observable store data and will re-render when that data changes.
   They can also mutate stores based on user input.
   Smart components render dumb components and pass them any applicable app state.
   These components are full React stateful components:
   ```
   class Component extends React.Component<any, any> { ... }
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
   
