const dotenv = require("dotenv");
const express = require('express');
const mysqli = require('mysql');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();



const db = mysqli.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const dbcse = mysqli.createConnection({
    host: process.env.DBCSE_HOST,
    user: process.env.DBCSE_USER,
    password: process.env.DBCSE_PASSWORD,
    database: process.env.DBCSE_NAME
});
dbcse.connect((err) => {
    if (err) {
        console.error('Error connecting to database CSE:', err.stack);
        return;
    }
    console.log('Connected to databaseCSE as id ' + dbcse.threadId);
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM login WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});

app.post('/facultylogin', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM facultylogin WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});
app.get('/csefaculty', (req, res) => {
    dbcse.query('SELECT * FROM csesem3', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
})

app.post('/users', (req, res) => {
    const sql = "INSERT INTO users (`id`,`name`,`regno`,`totcredit`, `totsum`, `prevcredit`) VALUES (?)";
    const values = [req.body.id, req.body.name, req.body.regno, req.body.totcredit, req.body.totsum, req.body.prevcredit];
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Value inserted successfully");
        }
    });
});


app.post('/students', (req, res) => {
    const { regno, name, dpt } = req.body;

    // Check if regno exists
    const checkQuery = 'SELECT * FROM students WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            // regno exists
            res.status(409).send({ message: 'Registration number already exists' });
        } else {
            // Insert new student
            const insertQuery = 'INSERT INTO students (regno, name, dpt) VALUES (?, ?, ?)';
            db.query(insertQuery, [regno, name, dpt], (err, result) => {
                if (err) throw err;
                res.send({ message: 'Registered successfully' });
            });
        }
    });
});

app.post('/sem1', (req, res) => {
    const { regno } = req.body;

    // Check if regno exists
    const checkQuery = 'SELECT * FROM sem1 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            // regno exists
            res.status(409).send({ message: 'Registration number already exists' });
        } else {

            const sql = "INSERT INTO sem1 (`regno`, `totsum`, `totcredit`, `prevcredit`, `gpa`,`cgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.totsum,
            req.body.totcredit,
            req.body.prevcredit,
            req.body.gpa,
            req.body.cgpa];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
});

app.get('/sem1/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, sem1.totsum, sem1.totcredit, sem1.prevcredit, sem1.gpa, sem1.cgpa 
        FROM students s
        JOIN sem1 ON s.regno = sem1.regno
        WHERE s.regno = ?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/sem2', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM sem2 WHERE regno2 = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO sem2 (`regno2`, `totsum2`, `totcredit2`, `prevcredit2`, `gpa2`,`cgpa2`) VALUES (?)";
            const values = [req.body.regno,
            req.body.totsum2,
            req.body.totcredit2,
            req.body.prevcredit,
            req.body.gpa2,
            req.body.cgpa2];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });

        }

    });
});
app.get('/sem2/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, sem2.totsum2, sem2.totcredit2, sem2.prevcredit2, sem2.gpa2, sem2.cgpa2 
        FROM students s
        JOIN sem2 ON s.regno = sem2.regno2
        WHERE s.regno = ?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.get('/sem1', (req, res) => {
    const sql = "SELECT * FROM sem1";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/sem2', (req, res) => {
    const sql = "SELECT * FROM sem2";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

// Cse department
app.post('/csesem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM csesem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem3 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredit`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/csesem3', (req, res) => {
    const sql = "SELECT * FROM csesem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem3.csetotsum, csesem3.csetotcredit, csesem3.cseprevcredit, csesem3.csegpa, csesem3.csecgpa 
        FROM students s
        JOIN csesem3 ON s.regno = csesem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/csesem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM csesem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem4 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredit`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/csesem4', (req, res) => {
    const sql = "SELECT * FROM csesem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem4.csetotsum, csesem4.csetotcredit, csesem4.cseprevcredit, csesem4.csegpa, csesem4.csecgpa 
        FROM students s
        JOIN csesem4 ON s.regno = csesem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/csesem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM csesem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem5 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredit`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/csesem5', (req, res) => {
    const sql = "SELECT * FROM csesem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem5.csetotsum, csesem5.csetotcredit, csesem5.cseprevcredit, csesem5.csegpa, csesem5.csecgpa 
        FROM students s
        JOIN csesem5 ON s.regno = csesem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/csesem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM csesem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem6 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredit`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/csesem6', (req, res) => {
    const sql = "SELECT * FROM csesem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem6.csetotsum, csesem6.csetotcredit, csesem6.cseprevcredit, csesem6.csegpa, csesem6.csecgpa 
        FROM students s
        JOIN csesem6 ON s.regno = csesem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/csesem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM csesem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem7 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredit`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/csesem7', (req, res) => {
    const sql = "SELECT * FROM csesem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem7.csetotsum, csesem7.csetotcredit, csesem7.cseprevcredit, csesem7.csegpa, csesem7.vsecgpa 
        FROM students s
        JOIN csesem7 ON s.regno = csesem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/csesem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM csesem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO csesem8 (`regno`, `csetotsum`, `csetotcredit`, `cseprevcredcse`, `csegpa`,`csecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.csetotsum,
            req.body.csetotcredit,
            req.body.cseprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/csesem8', (req, res) => {
    const sql = "SELECT * FROM csesem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/csesem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, csesem8.csetotsum, csesem8.csetotcredit, csesem8.cseprevcredit, csesem8.csegpa, csesem8.csecgpa 
        FROM students s
        JOIN csesem8 ON s.regno = csesem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});



// IT DEPARTMENT
app.post('/itsem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM itsem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/itsem3', (req, res) => {
    const sql = "SELECT * FROM itsem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem3.ittotsum, itsem3.ittotcredit, itsem3.itprevcredit, itsem3.itgpa, itsem3.itcgpa 
        FROM students s
        JOIN itsem3 ON s.regno = itsem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/itsem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM itsem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/itsem4', (req, res) => {
    const sql = "SELECT * FROM itsem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem4.ittotsum, itsem4.ittotcredit, itsem4.itprevcredit, itsem4.itgpa, itsem4.itcgpa 
        FROM students s
        JOIN itsem4 ON s.regno = itsem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/itsem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM itsem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/itsem5', (req, res) => {
    const sql = "SELECT * FROM itsem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem5.ittotsum, itsem5.ittotcredit, itsem5.itprevcredit, itsem5.itgpa, itsem5.itcgpa 
        FROM students s
        JOIN itsem5 ON s.regno = itsem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/itsem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM itsem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/itsem6', (req, res) => {
    const sql = "SELECT * FROM itsem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem6.ittotsum, itsem6.ittotcredit, itsem6.itprevcredit, itsem6.itgpa, itsem6.itcgpa 
        FROM students s
        JOIN itsem6 ON s.regno = itsem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/itsem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM itsem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/itsem7', (req, res) => {
    const sql = "SELECT * FROM itsem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem7.ittotsum, itsem7.ittotcredit, itsem7.itprevcredit, itsem7.itgpa, itsem7.itcgpa 
        FROM students s
        JOIN itsem7 ON s.regno = itsem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/itsem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM itsem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO itsem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/itsem8', (req, res) => {
    const sql = "SELECT * FROM itsem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/itsem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, itsem8.ittotsum, itsem8.ittotcredit, itsem8.itprevcredit, itsem8.itgpa, itsem8.itcgpa 
        FROM students s
        JOIN itsem8 ON s.regno = itsem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

//Ece departement


app.post('/ecesem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM ecesem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem3 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`,`ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/ecesem3', (req, res) => {
    const sql = "SELECT * FROM ecesem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem3.ecetotsum, ecesem3.ecetotcredit, ecesem3.eceprevcredit, ecesem3.ecegpa, ecesem3.ececgpa 
        FROM students s
        JOIN ecesem3 ON s.regno = ecesem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/ecesem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM ecesem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem4 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`,`ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/ecesem4', (req, res) => {
    const sql = "SELECT * FROM ecesem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem4.ecetotsum, ecesem4.ecetotcredit, ecesem4.eceprevcredit, ecesem4.ecegpa, ecesem4.ececgpa 
        FROM students s
        JOIN ecesem4 ON s.regno = ecesem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/ecesem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM ecesem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem5 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`,`ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/ecesem5', (req, res) => {
    const sql = "SELECT * FROM ecesem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem5.ecetotsum, ecesem5.ecetotcredit, ecesem5.eceprevcredit, ecesem5.ecegpa, ecesem5.ececgpa 
        FROM students s
        JOIN ecesem5 ON s.regno = ecesem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/ecesem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM ecesem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem6 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`,`ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/ecesem6', (req, res) => {
    const sql = "SELECT * FROM ecesem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem6.ecetotsum, ecesem6.ecetotcredit, ecesem6.eceprevcredit, ecesem6.ecegpa, ecesem6.ececgpa 
        FROM students s
        JOIN ecesem6 ON s.regno = ecesem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/ecesem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM ecesem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem7 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`, ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/ecesem7', (req, res) => {
    const sql = "SELECT * FROM ecesem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem7.ecetotsum, ecesem7.ecetotcredit, ecesem7.eceprevcredit, ecesem7.ecegpa, ecesem7.ececgpa 
        FROM students s
        JOIN ecesem7 ON s.regno = ecesem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/ecesem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM ecesem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO ecesem8 (`regno`, `ecetotsum`, `ecetotcredit`, `eceprevcredit`, `ecegpa`,`ececgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ecetotsum,
            req.body.ecetotcredit,
            req.body.eceprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/ecesem8', (req, res) => {
    const sql = "SELECT * FROM ecesem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/ecesem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, ecesem8.ecetotsum, ecesem8.ecetotcredit, ecesem8.eceprevcredit, ecesem8.ecegpa, ecesem8.ececgpa 
        FROM students s
        JOIN ecesem8 ON s.regno = ecesem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

//EEE departement

app.post('/eeesem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM eeesem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem3 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/eeesem3', (req, res) => {
    const sql = "SELECT * FROM eeesem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem3.eeetotsum, eeesem3.eeetotcredit, eeesem3.eeeprevcredit, eeesem3.eeegpa, eeesem3.eeecgpa 
        FROM students s
        JOIN eeesem3 ON s.regno = eeesem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/eeesem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM eeesem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem4 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/eeesem4', (req, res) => {
    const sql = "SELECT * FROM eeesem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem4.eeetotsum, eeesem4.eeetotcredit, eeesem4.eeeprevcredit, eeesem4.eeegpa, eeesem4.eeecgpa 
        FROM students s
        JOIN eeesem4 ON s.regno = eeesem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/eeesem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM eeesem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem5 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/eeesem5', (req, res) => {
    const sql = "SELECT * FROM eeesem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem5.eeetotsum, eeesem5.eeetotcredit, eeesem5.eeeprevcredit, eeesem5.eeegpa, eeesem5.eeecgpa 
        FROM students s
        JOIN eeesem5 ON s.regno = eeesem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/eeesem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM eeesem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem6 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/eeesem6', (req, res) => {
    const sql = "SELECT * FROM eeesem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem6.eeetotsum, eeesem6.eeetotcredit, eeesem6.eeeprevcredit, eeesem6.eeegpa, eeesem6.eeecgpa 
        FROM students s
        JOIN eeesem6 ON s.regno = eeesem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/eeesem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM eeesem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem7 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/eeesem7', (req, res) => {
    const sql = "SELECT * FROM eeesem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem7.eeetotsum, eeesem7.eeetotcredit, eeesem7.eeeprevcredit, eeesem7.eeegpa, eeesem7.eeecgpa 
        FROM students s
        JOIN eeesem7 ON s.regno = eeesem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/eeesem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM eeesem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO eeesem8 (`regno`, `eeetotsum`, `eeetotcredit`, `eeeprevcredit`, `eeegpa`,`eeecgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.eeetotsum,
            req.body.eeetotcredit,
            req.body.eeeprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/eeesem8', (req, res) => {
    const sql = "SELECT * FROM eeesem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/eeesem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, eeesem8.eeetotsum, eeesem8.eeetotcredit, eeesem8.eeeprevcredit, eeesem8.eeegpa, eeesem8.eeecgpa 
        FROM students s
        JOIN eeesem8 ON s.regno = eeesem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

// AI&DS department


app.post('/aidssem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM aidssem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem3 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/aidssem3', (req, res) => {
    const sql = "SELECT * FROM aidssem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/aidssem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, aidssem3.aidstotsum, aidssem3.aidstotcredit, aidssem3.aidsprevcredit, aidssem3.aidsgpa, aidssem3.aidscgpa 
        FROM students s
        JOIN aidssem3 ON s.regno = aidssem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/aidssem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM aidssem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem4 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/aidssem4', (req, res) => {
    const sql = "SELECT * FROM aidssem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/aidssem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, aidssem4.aidstotsum, aidssem4.aidstotcredit, aidssem4.aidsprevcredit, aidssem4.aidsgpa, aidssem4.aidscgpa 
        FROM students s
        JOIN aidssem4 ON s.regno = aidssem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/aidssem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM aidssem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem5 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/aidssem5', (req, res) => {
    const sql = "SELECT * FROM aidssem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/aidssem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, aidssem5.aidstotsum, aidssem5.aidstotcredit, aidssem5.aidsprevcredit, aidssem5.aidsgpa, aidssem5.aidscgpa 
        FROM students s
        JOIN aidssem5 ON s.regno = aidssem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/aidssem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM aidssem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem6 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/aidssem6', (req, res) => {
    const sql = "SELECT * FROM aidssem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/aidssem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, aidssem6.aidstotsum, aidssem6.aidstotcredit, aidssem6.aidsprevcredit, aidssem6.aidsgpa, aidssem6.aidscgpa 
        FROM students s
        JOIN aidssem6 ON s.regno = aidssem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/aidssem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM aidssem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem7 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/aidssem7', (req, res) => {
    const sql = "SELECT * FROM aidssem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/aidssem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, aidssem7.aidstotsum, aidssem7.aidstotcredit, aidssem7.aidsprevcredit, aidssem7.aidsgpa, aidssem7.aidscgpa 
        FROM students s
        JOIN aidssem7 ON s.regno = aidssem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/aidssem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM aidssem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO aidssem8 (`regno`, `aidstotsum`, `aidstotcredit`, `aidsprevcredit`, `aidsgpa`,`aidscgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.aidstotsum,
            req.body.aidstotcredit,
            req.body.aidsprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

//Mechanical department
app.post('/mechsem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM mechsem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem3 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.mechtotsum,
            req.body.mechtotcredit,
            req.body.mechprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/mechsem3', (req, res) => {
    const sql = "SELECT * FROM mechsem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem3.mechtotsum, mechsem3.mechtotcredit, mechsem3.mechprevcredit, mechsem3.mechgpa, mechsem3.mechcgpa 
        FROM students s
        JOIN mechsem3 ON s.regno = mechsem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/mechsem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM mechsem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem4 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.mechtotsum,
            req.body.mechtotcredit,
            req.body.mechprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/mechsem4', (req, res) => {
    const sql = "SELECT * FROM mechsem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem4.mechtotsum, mechsem4.mechtotcredit, mechsem4.mechprevcredit, mechsem4.mechgpa, mechsem4.mechcgpa 
        FROM students s
        JOIN mechsem4 ON s.regno = mechsem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/mechsem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM mechsem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem5 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.mechtotsum,
            req.body.mechtotcredit,
            req.body.mechprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/mechsem5', (req, res) => {
    const sql = "SELECT * FROM mechsem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem5.mechtotsum, mechsem5.mechtotcredit, mechsem5.mechprevcredit, mechsem5.mechgpa, mechsem5.mechcgpa 
        FROM students s
        JOIN mechsem5 ON s.regno = mechsem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/mechsem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM mechsem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem6 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.mechtotsum,
            req.body.mechtotcredit,
            req.body.mechprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/mechsem6', (req, res) => {
    const sql = "SELECT * FROM mechsem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem6.mechtotsum, mechsem6.mechtotcredit, mechsem6.mechprevcredit, mechsem6.mechgpa, mechsem6.mechcgpa 
        FROM students s
        JOIN mechsem6 ON s.regno = mechsem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/mechsem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM mechsem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem7 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.mechtotsum,
            req.body.mechtotcredit,
            req.body.mechprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/mechsem7', (req, res) => {
    const sql = "SELECT * FROM mechsem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem7.mechtotsum, mechsem7.mechtotcredit, mechsem7.mechprevcredit, mechsem7.mechgpa, mechsem7.mechcgpa 
        FROM students s
        JOIN mechsem7 ON s.regno = mechsem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/mechsem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM mechsem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem8 (`regno`, `mechtotsum`, `mechtotcredit`, `mechprevcredit`, `mechgpa`,`mechcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.ittotsum,
            req.body.ittotcredit,
            req.body.itprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/mechsem8', (req, res) => {
    const sql = "SELECT * FROM mechsem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/mechsem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, mechsem8.ittotsum, mechsem8.ittotcredit, mechsem8.itprevcredit, mechsem8.itgpa, mechsem8.itcgpa 
        FROM students s
        JOIN mechsem8 ON s.regno = mechsem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

// Civil department

app.post('/civilsem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM civilsem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem3 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/civilsem3', (req, res) => {
    const sql = "SELECT * FROM civilsem3";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem3/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem3.civiltotsum, civilsem3.civiltotcredit, civilsem3.civilprevcredit, civilsem3.civilgpa, civilsem3.itcgpa 
        FROM students s
        JOIN civilsem3 ON s.regno = civilsem3.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/civilsem4', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM civilsem4 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem4 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/civilsem4', (req, res) => {
    const sql = "SELECT * FROM civilsem4";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem4/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem4.civiltotsum, civilsem4.civiltotcredit, civilsem4.civilprevcredit, civilsem4.civilgpa, civilsem4.civilcgpa 
        FROM students s
        JOIN civilsem4 ON s.regno = civilsem4.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/civilsem5', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM civilsem5 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem5 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa5,
            req.body.cgpa5];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/civilsem5', (req, res) => {
    const sql = "SELECT * FROM civilsem5";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem5/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem5.civiltotsum, civilsem5.civiltotcredit, civilsem5.civilprevcredit, civilsem5.civilgpa, civilsem5.civilcgpa 
        FROM students s
        JOIN civilsem5 ON s.regno = civilsem5.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


app.post('/civilsem6', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM civilsem6 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem6 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa6,
            req.body.cgpa6];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    });
})

app.get('/civilsem6', (req, res) => {
    const sql = "SELECT * FROM civilsem6";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem6/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem6.civiltotsum, civilsem6.civiltotcredit, civilsem6.civilprevcredit, civilsem6.civilgpa, civilsem6.civilcgpa 
        FROM students s
        JOIN civilsem6 ON s.regno = civilsem6.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/civilsem7', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM civilsem7 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem7 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa3,
            req.body.cgpa3];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }
    })
});

app.get('/civilsem7', (req, res) => {
    const sql = "SELECT * FROM civilsem7";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem7/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem7.civiltotsum, civilsem7.civiltotcredit, civilsem7.civilprevcredit, civilsem7.civilgpa, civilsem7.civilcgpa 
        FROM students s
        JOIN civilsem7 ON s.regno = civilsem7.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});

app.post('/civilsem8', (req, res) => {
    const { regno } = req.body;
    const checkQuery = 'SELECT * FROM civilsem8 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO civilsem8 (`regno`, `civiltotsum`, `civiltotcredit`, `civilprevcredit`, `civilgpa`,`civilcgpa`) VALUES (?)";
            const values = [req.body.regno,
            req.body.civiltotsum,
            req.body.civiltotcredit,
            req.body.civilprevcredit,
            req.body.gpa4,
            req.body.cgpa4];
            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Value inserted successfully");
                }
            });
        }

    });
})

app.get('/civilsem8', (req, res) => {
    const sql = "SELECT * FROM civilsem8";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})

app.get('/civilsem8/:regno', (req, res) => {
    const regno = req.params.regno;
    const sql = `
        SELECT s.regno, s.name, s.dpt, civilsem8.civiltotsum, civilsem8.civiltotcredit, civilsem8.civilprevcredit, civilsem8.civilgpa, civilsem8.civilcgpa 
        FROM students s
        JOIN civilsem8 ON s.regno = civilsem8.regno
        WHERE s.regno =?`;
    db.query(sql, [regno], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result[0]); // Return the first match (unique regno)
        }
    });
});


////////////////////////////////////////////////////////////////



app.get('/students', (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }

    })
})



app.get('/', (req, res) => {
    return res.json("Backend side")
})
const port = process.env.DB_PORT;
app.listen(port, () => {
    console.log("Server is running on port 5000")
})

// FACULTY MANAGE DATA 
app.post('/api/insert', (req, res) => {
    const { table, rows } = req.body;  // Accept the table name from the frontend
    const sql = `INSERT INTO ?? (course_code, course_title, course_cred) VALUES ?`;  // Use ?? for table name
    const values = rows.map(row => [row.course_code, row.course_title, row.course_cred]);

    db.query(sql, [table, values], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// API route to update data
app.put('/api/update', (req, res) => {
    const { table, id, course_code, course_title, course_cred } = req.body;  // Accept the table name from the frontend
    const sql = `UPDATE ?? SET course_code = ?, course_title = ?, course_cred = ? WHERE id = ?`;  // Use ?? for table name

    db.query(sql, [table, course_code, course_title, course_cred, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// API route to fetch table names based on user authorization
app.get('/api/tables', (req, res) => {
    const allowedTables = ['sem1r2023']; // Example list of tables the user is allowed to see

    db.query("SHOW TABLES", (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Filter tables based on allowedTables array
        const tables = results.map(row => Object.values(row)[0])
            .filter(table => allowedTables.includes(table));

        res.json(tables);
    });
});
app.get("/api/tables", (req, res) => {
    const sql = "SHOW TABLES";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        const tables = result.map((row) => Object.values(row)[0]);
        res.json(tables);
    });
});

// Endpoint to get fields of a selected table

// Endpoint to get data of the selected table
app.get("/api/tableData", (req, res) => {
    const { table } = req.query;
    if (!table) return res.status(400).send("Table name is required.");

    const sql = `SELECT * FROM ${table}`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});



app.get('/api/admin/tables', (req, res) => {
    const sql = "SHOW TABLES";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        const tables = results.map(row => Object.values(row)[0]);
        res.send(tables);
    });
});
// API route to fetch data from a specific table
app.get("/api/admin/tabledata", (req, res) => {
    const { table } = req.query;
    if (!table) {
        return res.status(400).send("Table name is required.");
    }

    const sql = `SELECT * FROM ??`;
    db.query(sql, [table], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// API route to insert data into a selected table
app.post("/api/insert", (req, res) => {
    const { table, rows } = req.body;
    if (!table || !rows || rows.length === 0) {
        return res.status(400).send("Table name and rows are required.");
    }

    const columns = Object.keys(rows[0]);
    const values = rows.map((row) => columns.map((col) => row[col]));

    const sql = `INSERT INTO ?? (${columns.join(", ")}) VALUES ?`;
    db.query(sql, [table, values], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// API route to update data in a selected table
app.put("/api/update", (req, res) => {
    const { table, id, course_code, course_title, course_cred } = req.body;
    if (!table || !id) {
        return res.status(400).send("Table name and ID are required.");
    }

    const sql = `UPDATE ?? SET course_code = ?, course_title = ?, course_cred = ? WHERE id = ?`;
    db.query(sql, [table, course_code, course_title, course_cred, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});