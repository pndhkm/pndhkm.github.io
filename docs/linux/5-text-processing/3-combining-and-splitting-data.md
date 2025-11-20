# Combining and Splitting Data

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `join file1 file2`   | Combine lines with a common field                    |
| `paste file1 file2`  | Merge files side by side                             |
| `split -l 1000 file` | Split file into parts of 1000 lines each             |
| `tee file`           | Display output and write it to a file simultaneously |

Example:

```
cat data.txt | tee output.txt
```

Displays content on screen and saves it in `output.txt`.

Data1
```
cat data1.txt          
```

Output:
```
1 John
2 Yan
3 Ben
```

Data2
```
cat data2.txt 
```

Output:
```
1 IT
2 Owner
3 Finance
```

## Join
Command:
```
join data1.txt data2.txt 
```

Output:
```
1 John IT
2 Yan Owner
3 Ben Finance
```

## Paste

Command: 
```
paste data1.txt data2.txt 
```

Output:
```
1 John	1 IT
2 Yan	2 Owner
3 Ben	3 Finance
```