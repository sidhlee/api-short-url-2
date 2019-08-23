# api-short-url-2
improved from version 1 (based on fcc example)  
1. Used the latest package versions.
2. Used `mongoose-sequence` package for auto-incrementing id.
3. Now closes mongoose connection for `SIGINT` event (ctrl+c)
4. More semantic variable names.
5. Added new favicon
6. Removed the counter model. Now urlModel requires `mongoose-sequence` and sets up plugin to use it.
7. Changed unused regex capture group into non-capturing group.
8. Removed id validation logic. If it is not found in db, it will return "not found" anyways.  
   Maybe include for optimization. (Don't query the db at all for NaN values)  
9. Now with separated module and cleaner server.js

   
    

