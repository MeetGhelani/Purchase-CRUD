Keep in memory

this is a purchase CRUD sytstem in which first section is of basic puchase form entries with input fields as : Inward number (number only) , chalan no. (number only) , Date , Party name (custom dropdown with options) , terms , Remarks (Horizontal text area) , Purchase By (custom dropdown with Names).



Now second section below first section :

there are three parts two side by side half parts and one full below the two halfs.

Left side half part consists of detailed purchase entry from the above basic details.
This part consists of a form which has fields like : Item name (custom dropdown with item names), sub-parts (custom dropdown with sub-parts options) , QTY (quantity of items (numbers only),  Rate ( rate of that particular item (numbers + decimal values only), CGST (numbers with decimal values only (like 5%, 10%, 18.0% etc. basically a tax related column) , SGST (numbers with decimal values only (like 5%, 10%, 18.0% etc. basically a tax related column)) , SerTax (numbers with decimal values only (like 5%, 10%, 18.0% etc. basically a tax related column), Amount (numbers + decimal values only) , Remarks (Horizontal text area) .
Save and clear Buttons are also below this form. (to save and clear the fields)


Right side second half consists of AG grid component (basically table using AG Grid).
This part has AG grid table which has values added when user will fill (5,10 etc. entries) the purchase detailed form which on the left side and when he will save it, the details will be saved and stored in that AG grid container locally (not SQL database) and will be displayed immediately in that grid. 
And when user double click the row in this particular AG grid container, the AG grid (table) will populate that particular data from that particular row to the left side purchase detailed form and user can Save or clear that particular data.

Third part will be below the above two half's parts.
This part will contain four input fields : Total Amount (numbers + decimal values only) , Discount(%) (numbers + decimal values only) , Extra cost (numbers + decimal values only) , NetAmount (numbers + decimal values only) . And important thing is this part will be : the total amount input field will have the sum of all amounts present in the right side table (sum of amount column in the right side table) , and in discount input field user will type percentage of discount (optional field), And in Extra cost user will enter extra cost (optional) , Now the important input field NetAmount , in this the value will be calculated according to the beside three fields ((Total amount - Discount percentage) + Extra cost = Netamount) . Note: Total amount and NetAmount fields in this part are not editable because they are displaying the calculated values.

Till now user has filled the basic purchase form one time, and will be stored or will stay intact until the user will final save the whole purchase details combined.
And also user has filled the detailed purchase form with entries of data in the AG grid container (in the right side second half part of second section).

Now third section: 
starts with Save/Edit button (switches state based on conditions) , beside it Find button , beside it clear button (when clicked confirmation modal appears asking want to clear all the forms from the above sections), Delete button (when clicked confirmation modal appears asking want to Delete all the entries from this master entry).

At last in this section Same AG grid container component will be used to display the master entry data.

this master AG grid table will have fields from the above two sections : Invoice No. (Inward no. from section one) , P Date (purchase date from section 1), Party Name (from section 1) , Item Name (from above section), Qty (from above section) , Rate , Amount , Cgst , Sgst , Remark (from the first section)


Right now we have to implement only save data and show it in the below AG grid container. 

There will be two sql tables with purchase master and purchase detail master. In which data in purchase detailed master are mapped with the invoice no./ inward no. . basically the system in simple words when a parcel arrives which has been purchased by a company , then user has to enter the details like today in the morning one parcel came, that will be a single invoice conatining the items (purchase deatiled). so basic invoice details will be filled single time only in the first section, and items which are been purchased in that particular invoice will be added through the purchase detailed form, user will fill the basic details first, after that he will add items details for that particular invoice, and will be saved locally and displayed immediately in the right side half of second section , and when user has finished adding items, he will final save the whole invoice and the whole data will be stored in purchase master (having all the fields from section one) , and the purchase detail master table will have the items details from the second section. 


Tech stack:
Frontend : Angular , and for grids (AG grid)
Backend : ASP.NET core web API (strictly we will not EF core) 

our backend architecture will be this: 

Controller (Responsibilities: Receive API requests, Validate request state, Return HTTP responses, etc.)
   ↓
Service (Responsibilities: Business rules, Cross-table validations, Status checks)
   ↓
Repository (Responsibilities: ADO.NET access, Stored procedure execution, Database communication)
   ↓
Stored Procedures (Responsibilities: Database operations)
   ↓
SQL Server

Database : SQL server database (localhost right now)

And also this whole process will be phase by phase you need to generate a detailed plan for this, and keep in memory that we will keep integrity and safety of data while implementing source code control, and you will also provide detailed steps of instructions and also full code for a file and when changes or updates will be happen you will provide excat location and file where to do what. and i will also not share anything private related to database so data and privacy will be maintined, so we will work according to this. this will be a development + learning cycle.






