# SQLite Basic Commands

This is the complete content of tabel **barang**:

| kode | nama     | stok | harga  |
| ---- | -------- | ---- | ------ |
| M123 | Monitor  | 12   | 600000 |
| B441 | Keyboard | 8    | 150000 |
| X900 | Speaker  | 5    | 800000 |
| M555 | Mouse    | 3    | 200000 |
| A777 | Harddisk | 20   | 900000 |

---

### Start SQLite

Input:

```
sqlite3 database.db
```

This opens the SQLite shell for the database.

---

### Creating a table named barang

Input:

```
CREATE TABLE barang (kode TEXT, nama TEXT, stok INTEGER, harga INTEGER);
```

This defines the table structure.

---

### Inserting all 5 rows into barang

Input:

```
INSERT INTO barang VALUES
 ('M123','Monitor',12,600000),
 ('B441','Keyboard',8,150000),
 ('X900','Speaker',5,800000),
 ('M555','Mouse',3,200000),
 ('A777','Harddisk',20,900000);
```

This stores all items into the table.

---

### Showing all data from table barang

Input:

```
SELECT * FROM barang;
```

Output:

```
M123|Monitor|12|600000
B441|Keyboard|8|150000
X900|Speaker|5|800000
M555|Mouse|3|200000
A777|Harddisk|20|900000
```

This displays everything in the table.

---

### Displaying items where kode starts with M

Input:

```
SELECT * FROM barang WHERE kode LIKE 'M%';
```

Output:

```
M123|Monitor|12|600000
M555|Mouse|3|200000
```

This matches kode beginning with M.

---

### Displaying items where nama ends with letter K

Input:

```
SELECT * FROM barang WHERE nama LIKE '%K';
```

Output:

```
X900|Speaker|5|800000
```

This finds names ending with K.

---

### Updating stok to 30 for kode M123

Input:

```
UPDATE barang SET stok = 30 WHERE kode = 'M123';
```

This modifies the stok for M123.

---

### Adding a new column kategori to barang

Input:

```
ALTER TABLE barang ADD COLUMN kategori TEXT;
```

This extends the table with a new column.

---

### Deleting rows where nama contains letter b

Input:

```
DELETE FROM barang WHERE nama LIKE '%b%' OR nama LIKE '%B%';
```

This removes rows containing letter b in the name.

---

### Showing kode and nama where harga > 500000

Input:

```
SELECT kode, nama FROM barang WHERE harga > 500000;
```

Output:

```
M123|Monitor
X900|Speaker
A777|Harddisk
```

This returns expensive items.

---

### Increasing stok by 5 for items where stok < 10

Input:

```
UPDATE barang SET stok = stok + 5 WHERE stok < 10;
```

This adds 5 to low-stock items.

---
