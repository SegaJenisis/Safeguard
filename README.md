# Safeguard React Native

A react native android app designed for security guards and managers. 
The purpose of the app was to work on a project that required the use of the NFC capabilities of android devices and provide a different use case other than payments.

The app provides the ability for managers to track the patrol activity of security guards on duty. This is done by assigning a shift, location, and an route to a guard who then is required to tap on uniquely identified NFC tags on the route on an hourly basis to confirm their presence. 


App provide the following functionality 

### 1. Ability to create buildings and add tag locations within the building
- Update building details and tags
- Delete the building and or tag locations within the building

### 2. Add routes to that building
- To add a route, assign the route a name and choose the tag locations you would like as part of that route. Once tags locations are created, you may drag and drop the items in a list in the order you want them visited as a part of the route.
- Route deletion functionality 
- Route order update functionality 

### 3. Assign a shift as a manager
   - Pick a predefined slot from a list 
      ( 9am -5 pm, 5pm -12am)
   - Select a guard for that shift
   - Select a building
   - Select the route for that building
   - Select the dates( can be multiple dates to create shifts for same time )  

### 4. View shifts as a guard
- Guard is able to view his or her upcoming shifts 

### 6. Write locations to NFC tags as manager
- Manager is able to select a building, then select the tag location in the building and write that tag location to the NFC tag

### 5. Guard is able to tap a tag during his shift 

### 6. Tap log view for the manager


Please note - google-services.json has been removed inorder to keep my firebase credentials confidential, please set up your own firebase project and add the file.
