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
            const sql = "INSERT INTO csesem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, csesem7.ittotsum, csesem7.ittotcredit, csesem7.itprevcredit, csesem7.itgpa, csesem7.itcgpa 
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
            const sql = "INSERT INTO csesem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, csesem8.ittotsum, csesem8.ittotcredit, csesem8.itprevcredit, csesem8.itgpa, csesem8.itcgpa 
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
            const sql = "INSERT INTO ecesem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem3.ittotsum, ecesem3.ittotcredit, ecesem3.itprevcredit, ecesem3.itgpa, ecesem3.itcgpa 
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
            const sql = "INSERT INTO ecesem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem4.ittotsum, ecesem4.ittotcredit, ecesem4.itprevcredit, ecesem4.itgpa, ecesem4.itcgpa 
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
            const sql = "INSERT INTO ecesem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem5.ittotsum, ecesem5.ittotcredit, ecesem5.itprevcredit, ecesem5.itgpa, ecesem5.itcgpa 
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
            const sql = "INSERT INTO ecesem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem6.ittotsum, ecesem6.ittotcredit, ecesem6.itprevcredit, ecesem6.itgpa, ecesem6.itcgpa 
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
            const sql = "INSERT INTO ecesem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem7.ittotsum, ecesem7.ittotcredit, ecesem7.itprevcredit, ecesem7.itgpa, ecesem7.itcgpa 
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
            const sql = "INSERT INTO ecesem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, ecesem8.ittotsum, ecesem8.ittotcredit, ecesem8.itprevcredit, ecesem8.itgpa, ecesem8.itcgpa 
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
            const sql = "INSERT INTO eeesem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem3.ittotsum, eeesem3.ittotcredit, eeesem3.itprevcredit, eeesem3.itgpa, eeesem3.itcgpa 
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
            const sql = "INSERT INTO eeesem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem4.ittotsum, eeesem4.ittotcredit, eeesem4.itprevcredit, eeesem4.itgpa, eeesem4.itcgpa 
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
            const sql = "INSERT INTO eeesem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem5.ittotsum, eeesem5.ittotcredit, eeesem5.itprevcredit, eeesem5.itgpa, eeesem5.itcgpa 
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
            const sql = "INSERT INTO eeesem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem6.ittotsum, eeesem6.ittotcredit, eeesem6.itprevcredit, eeesem6.itgpa, eeesem6.itcgpa 
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
            const sql = "INSERT INTO eeesem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem7.ittotsum, eeesem7.ittotcredit, eeesem7.itprevcredit, eeesem7.itgpa, eeesem7.itcgpa 
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
            const sql = "INSERT INTO eeesem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, eeesem8.ittotsum, eeesem8.ittotcredit, eeesem8.itprevcredit, eeesem8.itgpa, eeesem8.itcgpa 
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
            const sql = "INSERT INTO aidssem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, aidssem3.ittotsum, aidssem3.ittotcredit, aidssem3.itprevcredit, aidssem3.itgpa, aidssem3.itcgpa 
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
            const sql = "INSERT INTO aidssem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, aidssem4.ittotsum, aidssem4.ittotcredit, aidssem4.itprevcredit, aidssem4.itgpa, aidssem4.itcgpa 
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
            const sql = "INSERT INTO aidssem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, aidssem5.ittotsum, aidssem5.ittotcredit, aidssem5.itprevcredit, aidssem5.itgpa, aidssem5.itcgpa 
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
            const sql = "INSERT INTO aidssem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, aidssem6.ittotsum, aidssem6.ittotcredit, aidssem6.itprevcredit, aidssem6.itgpa, aidssem6.itcgpa 
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
            const sql = "INSERT INTO aidssem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, aidssem7.ittotsum, aidssem7.ittotcredit, aidssem7.itprevcredit, aidssem7.itgpa, aidssem7.itcgpa 
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
            const sql = "INSERT INTO aidssem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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

//Mechanical department
app.post('/mechsem3', (req, res) => {
    const { regno } = req.body;
    checkQuery = 'SELECT * FROM mechsem3 WHERE regno = ?';
    db.query(checkQuery, [regno], (err, result) => {
        if (err) throw err;
        if (result.length > 0) { res.status(409).send({ message: 'Registration number already exists' }); } else {
            const sql = "INSERT INTO mechsem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, mechsem3.ittotsum, mechsem3.ittotcredit, mechsem3.itprevcredit, mechsem3.itgpa, mechsem3.itcgpa 
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
            const sql = "INSERT INTO mechsem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, mechsem4.ittotsum, mechsem4.ittotcredit, mechsem4.itprevcredit, mechsem4.itgpa, mechsem4.itcgpa 
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
            const sql = "INSERT INTO mechsem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, mechsem5.ittotsum, mechsem5.ittotcredit, mechsem5.itprevcredit, mechsem5.itgpa, mechsem5.itcgpa 
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
            const sql = "INSERT INTO mechsem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, mechsem6.ittotsum, mechsem6.ittotcredit, mechsem6.itprevcredit, mechsem6.itgpa, mechsem6.itcgpa 
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
            const sql = "INSERT INTO mechsem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, mechsem7.ittotsum, mechsem7.ittotcredit, mechsem7.itprevcredit, mechsem7.itgpa, mechsem7.itcgpa 
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
            const sql = "INSERT INTO mechsem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
            const sql = "INSERT INTO civilsem3 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem3.ittotsum, civilsem3.ittotcredit, civilsem3.itprevcredit, civilsem3.itgpa, civilsem3.itcgpa 
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
            const sql = "INSERT INTO civilsem4 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem4.ittotsum, civilsem4.ittotcredit, civilsem4.itprevcredit, civilsem4.itgpa, civilsem4.itcgpa 
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
            const sql = "INSERT INTO civilsem5 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem5.ittotsum, civilsem5.ittotcredit, civilsem5.itprevcredit, civilsem5.itgpa, civilsem5.itcgpa 
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
            const sql = "INSERT INTO civilsem6 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem6.ittotsum, civilsem6.ittotcredit, civilsem6.itprevcredit, civilsem6.itgpa, civilsem6.itcgpa 
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
            const sql = "INSERT INTO civilsem7 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem7.ittotsum, civilsem7.ittotcredit, civilsem7.itprevcredit, civilsem7.itgpa, civilsem7.itcgpa 
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
            const sql = "INSERT INTO civilsem8 (`regno`, `ittotsum`, `ittotcredit`, `itprevcredit`, `itgpa`,`itcgpa`) VALUES (?)";
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
        SELECT s.regno, s.name, s.dpt, civilsem8.ittotsum, civilsem8.ittotcredit, civilsem8.itprevcredit, civilsem8.itgpa, civilsem8.itcgpa 
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
