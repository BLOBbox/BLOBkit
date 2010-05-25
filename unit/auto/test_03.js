/** Template

doTest({
	name: "",
	expectedException: false,
	expectedValue: true,
	reference: "", // url where the api is documented
	test: function() {
		return true;
	}
});

*/

setTimeout(function() {

	appendMessage("*** STARTING TEST ***");
	
	doTest({
		name: "Sql: Object Exists",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("Control if BlobDatabase exists - Only trusted apps");
			var db = new BlobDatabase("test_emilio");
			db.close();
			return true;
		}
	});
	
	doTest({
		name: "Sql:table not exists",
		expectedException: false,
		expectedValue: false,
		reference: "",
		test: function() {
			appendMessage("Control if table 'test_table' not exists");
			var db = new BlobDatabase("test_emilio");
			var exist = db.isTablePresent("test_table");
			if(exist){
				appendMessage("FALSE: table 'test_table' exists");
			}else{
				appendMessage("TRUE: table 'test_table' not exists");
			}
			db.close();
			return exist;
		}
	});
	
	doTest({
		name: "Sql:create table",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("Create table 'test_table_02' if not exists");
			var db = new BlobDatabase("test_emilio");
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			appendMessage("Table created: rows:" + rows);
			var exist = db.isTablePresent("test_table_02");
			if(exist){
				appendMessage("TRUE: table 'test_table_02' exists");
			}else{
				appendMessage("FALSE: table 'test_table_02' not exists");
			}
			db.close();
			return exist;
			
		}
	});
	
	doTest({
		name: "Sql:create table and insert rows",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("Insert one row into test_table_02");
			var db = new BlobDatabase("test_emilio");
			db.modify("DROP TABLE IF EXISTS test_table_02");
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			rows = db.modify('INSERT INTO test_table_02 VALUES ("test",1,  datetime("now") )');
			appendMessage("Row inserted: " + rows);
			db.close();
			return true;
			
		}
	});
	
	doTest({
		name: "Sql:extract rows",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("Extract rows from test_table_02");
			var db = new BlobDatabase("test_emilio");
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                /*var name=results.getStringByName("name");
	                var val=results.getIntByName("value");
	                var thetime=results.getStringByName("thetime");*/
	                // do something useful with name, val, thetime...
	                //appendMessage("Row " + count + ": "+ name + "," + val + "," + thetime);
	                count++;
	        }
	        appendMessage("Rows count: " + count);
			db.close();
			if(count === 1)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql:delete table",
		expectedException: false,
		expectedValue: false,
		reference: "",
		test: function() {
			appendMessage("Delete table");
			var db = new BlobDatabase("test_emilio");
			var rows = db.modify("DROP TABLE IF EXISTS test_table_02");
			//appendMessage("Table deleted: " + rows);
			var exist = db.isTablePresent("test_table_02");
			if(exist){
				appendMessage("FALSE: table 'test_table_02' exist");
			}else{
				appendMessage("TRUE: table 'test_table_02' not exist");
			}
			db.close();
			return exist;
		}
	});
	
	
	doTest({
		name: "Sql:create table and insert a lot of rows with begin commit syntax",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("multiple insert");
			var max = 100; 
			
			var db = new BlobDatabase("test_emilio");
			//var rows = 0;
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			appendMessage("created table: rows: " + rows);
			var query = "BEGIN;";
			var insert = "INSERT INTO test_table_02 VALUES ";
			
			for(var a = 0; a < max; a++){
				var tmp = insert + '("test_' + a + '",' + a + ',datetime("now"));'; 
				query += tmp;
			}
			query += "COMMIT;"
			
			appendMessage("Insert one hundred of rows into test_table_02");
			rows = db.modify(query);
			appendMessage("added " + max + " rows, result: " + rows);	
			
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Rows count: " + count);
	        
			db.close();
			if(max === rows)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql:create table and insert a lot of rows - 2",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("multiple insert in one transaction");
			var max = 100; 
			
			var db = new BlobDatabase("test_emilio");
			//var rows = 0;
			var rows = db.modify("DROP TABLE IF EXISTS test_table_02");
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			appendMessage("created table: rows: " + rows);
			var query = "";
			var insert = "INSERT INTO test_table_02 VALUES ";
			
			for(var a = 0; a < max; a++){
				var tmp = insert + '("test_' + a + '",' + a + ',datetime("now"));'; 
				query += tmp;
			}
			
			appendMessage("Insert one hundred of rows into test_table_02");
			rows = db.modify(query);
			appendMessage("added " + max + " rows, result: " + rows);	
			
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Rows count: " + count);
	        
			db.close();
			if(max === rows)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql:create table and insert a lot of rows - 3",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("multiple insert with separate transactions");
			var max = 100; 
			
			var db = new BlobDatabase("test_emilio");
			//var rows = 0;
			var rows = db.modify("DROP TABLE IF EXISTS test_table_02");
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			appendMessage("created table: rows: " + rows);
			
			for(var a = 0; a < max; a++){
				db.modify('INSERT INTO test_table_02 VALUES ("test",' + a + ',  datetime("now") )');
			}
			
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Rows count: " + count);
	        
			db.close();
			if(max === count)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql: delete rows",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("delete odd rows");
			var db = new BlobDatabase("test_emilio");
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        } 
	        appendMessage("total rows: " + count);
			db.modify("DELETE from test_table_02 where value % 2 <> 0");
			
			results = db.query("SELECT * FROM test_table_02");
	        count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Final rows count: " + count);
	        
			db.close();
			if(count === 50)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql: truncate",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("delete all rows");
			var db = new BlobDatabase("test_emilio");
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        } 
	        appendMessage("total rows: " + count);
			db.modify("DELETE from test_table_02");
			
			results = db.query("SELECT * FROM test_table_02");
	        count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Final rows count: " + count);
	        
			db.close();
			if(count === 0)
				return true;
			else
				return false;
			
		}
	});
	
	/**
	 * The memory test fails for rows > 5000 (about)
	 */
	doTest({
		name: "Sql: memory test, 1.000 rows",
		expectedException: false,
		expectedValue: true,
		reference: "",
		test: function() {
			appendMessage("multiple insert with separate transactions");
			var max = 1000; 
			
			var db = new BlobDatabase("test_emilio");
			//var rows = 0;
			var rows = db.modify("DROP TABLE IF EXISTS test_table_02");
			var rows = db.modify("CREATE TABLE IF NOT EXISTS test_table_02 ( name VARCHAR(128), value INTEGER, thetime TIMESTAMP)");
			appendMessage("created table: rows: " + rows);
			
			for(var a = 0; a < max; a++){
				db.modify('INSERT INTO test_table_02 VALUES ("test",' + a + ',  datetime("now") )');
			}
			
			var results = db.query("SELECT * FROM test_table_02");
	        var count=0;
	        while(results.next()) {
	                count++;
	        }
	        appendMessage("Rows count: " + count);
	        
			db.close();
			if(max === count)
				return true;
			else
				return false;
			
		}
	});
	
	doTest({
		name: "Sql:delete table",
		expectedException: false,
		expectedValue: false,
		reference: "",
		test: function() {
			appendMessage("Delete table");
			var db = new BlobDatabase("test_emilio");
			var rows = db.modify("DROP TABLE IF EXISTS test_table_02");
			//appendMessage("Table deleted: " + rows);
			var exist = db.isTablePresent("test_table_02");
			if(exist){
				appendMessage("FALSE: table 'test_table_02' exist");
			}else{
				appendMessage("TRUE: table 'test_table_02' not exist");
			}
			db.close();
			return exist;
		}
	});

	appendMessage("*** TEST DONE ***");

}, 3000);
