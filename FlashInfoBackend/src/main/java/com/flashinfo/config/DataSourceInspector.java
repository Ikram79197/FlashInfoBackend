// package com.flashinfo.config;

// import jakarta.annotation.PostConstruct;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.stereotype.Component;

// import javax.sql.DataSource;
// import java.sql.Connection;
// import java.sql.DatabaseMetaData;
// import java.sql.ResultSet;

// @Component
// public class DataSourceInspector {

//     private static final Logger log = LoggerFactory.getLogger(DataSourceInspector.class);

//     private final DataSource dataSource;

//     public DataSourceInspector(DataSource dataSource) {
//         this.dataSource = dataSource;
//     }

//     @PostConstruct
//     public void inspect() {
//         try (Connection conn = dataSource.getConnection()) {
//             DatabaseMetaData md = conn.getMetaData();
//             String url = md.getURL();
//             String user = md.getUserName();
//             log.info("Datasource URL: {}", url);
//             log.info("Datasource user: {}", user);

//             // Check current database name
//             try (ResultSet rs = conn.createStatement().executeQuery("SELECT DB_NAME() AS current_db")) {
//                 if (rs.next()) {
//                     log.info("Connected to database: {}", rs.getString("current_db"));
//                 }
//             } catch (Exception e) {
//                 log.debug("Could not query current DB name: {}", e.getMessage());
//             }

//             // Look for the table in several possible schema cases
//             boolean found = false;
//             String[] schemasToTry = new String[] {"dbo", user, null};
//             for (String schema : schemasToTry) {
//                 try (ResultSet tables = md.getTables(null, schema, "SMP_CA_RECAP_FLASH_INFO", new String[] {"TABLE", "VIEW"})) {
//                     if (tables.next()) {
//                         String foundSchema = tables.getString("TABLE_SCHEM");
//                         String tableName = tables.getString("TABLE_NAME");
//                         log.info("Found table: {}.{}", foundSchema, tableName);
//                         found = true;
//                         break;
//                     }
//                 }
//             }
//             if (!found) {
//                 log.warn("Table SMP_CA_RECAP_FLASH_INFO not found via JDBC metadata. This can cause runtime SQL errors.");
//             }

//         } catch (Exception ex) {
//             log.error("Error inspecting DataSource: {}", ex.getMessage(), ex);
//         }
//     }
// }
