const express = require("express");
const conn = require("./connection");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", require("ejs").renderFile);

app.use(express.static("Files"));
const fs = require("fs");

const { Console, log } = require("console");

const port = 3001;

app.get("/", (req, res) => {
  res.send(fs.readFileSync("Files/start.html", "utf-8"));
});

app.get("/home", (req, res) => {
  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/home.html", "utf-8")
  );
});
app.get("/CheckHome", (req, res) => {
  res.send(fs.readFileSync("Files/CheckHome.html", "utf-8"));
});

app.get("/emp", (req, res) => {
  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/emp.html", "utf-8")
  );
});

app.get("/growth", (req, res) => {
  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/growth.html", "utf-8")
  );
});

app.get("/add", (req, res) => {
  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/add.html", "utf-8")
  );
});

app.post("/add", (req, res) => {
  let name = req.body.name;
  let area = req.body.area;
  let number = req.body.number;
  let salary = req.body.salary;
  let code = req.body.code;

  conn.connect((err) => {
    if (err) console.log(err);

    let sql =
      "INSERT INTO `employyee`(`id`, `name`, `area`, `number`, `salary`,`code`) VALUES ('','" +
      name +
      "','" +
      area +
      "','" +
      number +
      "','" +
      salary +
      "','" +
      code +
      "')";

    conn.query(sql, (err, data) => {
      if (err) console.log(err);
      else {
        res.redirect("/refresh1");
      }
    });
  });
});


app.get("/refresh1", (req, res) => {
  conn.connect((err) => {
    if (err) console.log("Line x" + err);
    let sql = "SELECT * FROM `employyee`";

    conn.query(sql, (err, data) => {
      if (err) console.log("in 41");

      console.log(data);
      let emp = `let emp = ${JSON.stringify(data)} `;

      fs.writeFileSync("Files/emp.js", emp);
    });
    res.redirect("/emp");
  });
});

app.get("/setting", (req, res) => {
  conn.connect((err) => {
    if (err) console.log(err);

    let sql = "SELECT * FROM `employyee` WHERE id = '" + req.query.id + "'";
    conn.query(sql, (err, data) => {
      if (err) console.log(err);
      else {
        res.redirect(
          `/edit?id=${data[0].id}&name=${data[0].name}&area=${data[0].area}&number=${data[0].number}&salary=${data[0].salary}`
        );
      }
    });
  });
});

app.get("/message", (req, res) => {
  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/message.html", "utf-8")
  );
});

app.post("/message", (req, res) => {
  let id = req.body.id;
  let message = req.body.message;

  let sql = `INSERT INTO task (task, state, toid) VALUES ('${message}', '0', '${id}')`;

  conn.query(sql, (err, data) => {
    if (err) console.log(err);
    else {
      res.redirect("/refreshemp");
    }
  });
});


app.get("/refreshemp", (req, res) => {
  conn.connect((err) => {
    if (err) console.log("Line x" + err);
    let sql = "SELECT * FROM `task`";

    conn.query(sql, (err, data) => {
      if (err) console.log("in 41");

      console.log(data);
      let emp = `let task = ${JSON.stringify(data)} `;

      fs.writeFileSync("Files/task.js", emp);
    });
    res.redirect("/emp");
  });
});


app.get("/edit", (req, res) => {
  let data = req.query;
  data = JSON.stringify(req.query);
  console.log(data);

  data = `var data=${data}`;
  fs.writeFileSync("Files/ProductToEdit.js", data);

  res.send(
    fs.readFileSync("Components/navbar.html", "utf-8") +
      fs.readFileSync("Files/edit.html", "utf-8")
  );
});

app.post("/edit", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let area = req.body.area;
  let number = req.body.number;
  let salary = req.body.salary;

  conn.connect((err) => {
    if (err) console.log(err);

    let sql =
      "UPDATE `employyee` SET `id` = " +
      id +
      ", `name` = '" +
      name +
      "', `area` = '" +
      area +
      "', `number` = '" +
      number +
      "', `salary` = '" +
      salary +
      "' WHERE `id` = " +
      id;

    conn.query(sql, (err, data) => {
      if (err) console.log(err);
      else {
        res.redirect("/refresh");
      }
    });
  });
});

app.get("/user", (req, res) => {
  res.send(fs.readFileSync("Files/user.html", "utf-8"));
});

app.get("/loginUser", (req, res) => {
  res.send(fs.readFileSync("Files/userlogin.html", "utf-8"));
});
app.get("/loginUserError", (req, res) => {
  res.send(fs.readFileSync("Files/loginUserError.html", "utf-8"));
});

app.get("/varifyUser", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;

  console.log(id + " & " + code);

  let sql = `SELECT * FROM employyee WHERE id = ${id} `;
  conn.query(sql, (err, data) => {
    if (err) console.log(err);
    else {
      console.log(data[0]);

      if (data[0].code == code) {
        res.redirect("/userLogined1");
      } else {
        res.redirect("/loginUserError");
      }
    }
  });
});

app.get("/userLogined1", (req, res) => {
  res.redirect("/refresh2");
});

app.get("/userLogined", (req, res) => {

  res.send(fs.readFileSync("Files/loginedUser.html", "utf-8"));

});

app.get("/refresh2", (req, res) => {
    conn.connect((err) => {
      if (err) console.log("Line x" + err);
      let sql = "SELECT * FROM `task`";
  
      conn.query(sql, (err, data) => {
        if (err) console.log("in 41");
  
        console.log(data);
        let emp = `let task = ${JSON.stringify(data)} `;
  
        fs.writeFileSync("Files/task.js", emp);
      });
      res.redirect("/userLogined");
    });
  });

app.get("/taskHeld", (req, res) => {
  let sql = `UPDATE task SET state = 1 WHERE task = '${req.query.taskDone}'`;
  conn.query(sql, (err, data) => {
    if (err) console.log(err);
    else {
      res.redirect("/refresh2");
    }   
  });
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
