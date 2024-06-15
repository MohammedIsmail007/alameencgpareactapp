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
    const checkQuery = 'SELECT * FROM sem2 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO sem2 (`regno`, `totsum2`, `totcredit2`, `prevcredit2`, `gpa2`,`cgpa2`) VALUES (?)";
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
        JOIN sem2 ON s.regno = sem2.regno
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
