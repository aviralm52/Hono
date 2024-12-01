import { Hono } from "hono";
import { stream, streamText, streamSSE } from "hono/streaming";

const app = new Hono();

interface Person {
  name: string;
  email: string;
  phone: string;
}

let persons: Person[] = [];

app.get("/", (c) => {
  return c.text("hello everyone");
});

app.post("/addPerson", async (c) => {
  const { name, email, phone } = await c.req.json();
  persons.push({
    name,
    email,
    phone,
  });
  return c.text("person added");
});

app.get("/getAllPersons", (c) => {
  return c.json(persons);
});

// streaming
app.get("/getPersonsInStream", (c) => {
  return streamText(c, async (stream) => {
    for (const video of persons) {
      await stream.writeln(JSON.stringify(video));
      await stream.sleep(1000);
    }
  });
});

// Read by Email
app.get("/person/:email", async (c) => {
  const { email } = c.req.param();
  const person = persons.find((person) => person.email === email);
  if (!person) {
    return c.json({ error: "Person not found" }, 404);
  }
  return c.json(
    { message: `Person with email ${email} is ${person?.name}` },
    200
  );
});

// update
app.put("/person/:email", async (c) => {
  const { email } = c.req.param();
  const person = persons.find((person) => person.email === email);
  if (!person) {
    return c.json({ error: "Person not found" }, 404);
  }
  const { name } = await c.req.json();
  person.name = name;
  return c.json({ message: "Person updated" }, 200);
});

// delete
app.delete("/person/:email", async (c) => {
  const { email } = c.req.param();
  const person = persons.find((person) => person.email === email);
  if (!person) {
    return c.json({ error: "Person not found" }, 404);
  }
  persons = persons.filter((person) => person.email !== email);
  return c.json({ message: "Person deleted" }, 200);
});

// delete all values
app.delete("/delete", async (c) => {
  persons = [];
  return c.json({ message: "All values deleted" }, 200);
});

export default app;