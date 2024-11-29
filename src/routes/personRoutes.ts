import { Hono } from "hono";
import connectDB from "../util/db";
import { IPerson, persons } from "../model/personModel";
import { streamText } from "hono/streaming";

connectDB();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Aapka Swaagat hai 🙏");
});

app.get("/getPerson/:email", async (c) => {
  try {
    const { email } = c.req.param();

    if (!email) {
      return c.json({ error: "Email bhi to do 😒" }, 400);
    }
    const person = await persons.findOne({ email });
    if (!person) {
      return c.json({ error: "Person nhi hai 😐" }, 404);
    }

    return c.json(person, 200);
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

app.get("/getAllPersons", async (c) => {
  try {
    const allPersons = await persons.find({});
    if (!allPersons.length) {
      return c.json({ error: "ek bhi person nhi hai 😐" }, 404);
    }
    return c.json(allPersons, 200);
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

app.get("/getBio/:email", async (c) => {
  try {
    const { email } = c.req.param();

    if (!email) {
      return c.json({ error: "Email bhi to do 😒" }, 400);
    }

    const person = await persons.findOne({ email });
    if (!person) {
      return c.json({ error: "Person nhi hai 😐" }, 404);
    }

    if (!person?.bio) return c.text("Bhai ka bio khali hai 😥");

    return streamText(c, async (stream) => {
      stream.onAbort(() => {
        console.log("Aborted!");
      });

      for (let i = 0; i < person.bio!.length; i++) {
        await stream.write(person.bio![i]);
        await stream.sleep(100);
      }
    });
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

app.post("/addPerson", async (c) => {
  try {
    const reqBody: IPerson = await c.req.json();

    const { name, email, phone, age, bio } = reqBody;

    if (!name || !email || !age) {
      return c.json({ error: "Data poora nhi hai 😒" }, 400);
    }

    const person = await persons.create({
      name,
      email,
      age,
      phone,
      bio,
    });

    if (!person) {
      return c.json({ error: "Person nhi ban paaya 😢" }, 400);
    }

    return c.json(
      { data: person.toObject(), message: "Person Add ho gaya 🎉" },
      200
    );
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

app.patch("/updateDetails/:email", async (c) => {
  try {
    const { email } = c.req.param();

    const reqBody: IPerson = await c.req.json();
    const { phone, bio } = reqBody;

    if (!email) {
      return c.json({ error: "Email bhi to do 😒" }, 400);
    }

    if (!phone && !bio) {
      return c.json(
        { error: "Phone number ya bio kuch to do update karne ke liye? 😤" },
        400
      );
    }

    if (phone && bio)
      await persons.findOneAndUpdate({ email }, { $set: { phone, bio } });

    if (phone) await persons.findOneAndUpdate({ email }, { $set: { phone } });

    if (bio) await persons.findOneAndUpdate({ email }, { $set: { bio } });

    return c.json({ message: "Details update ho gyi 🎉" }, 200);
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

app.delete("/deletePerson/:email", async (c) => {
  try {
    const { email } = c.req.param();

    if (!email) {
      return c.json({ error: "Email bhi to do 😒" }, 400);
    }

    const person = await persons.deleteOne({ email });
    if (!person) return c.json({ error: "Person nhi hai 😐" }, 404);

    if (person.deletedCount === 0)
      return c.json({ error: "Person nhi hai 😐" }, 404);

    return c.json({ message: "Person Delete ho gaya 🎉" }, 200);
  } catch (err) {
    return c.json({ error: (err as any).message }, 500);
  }
});

export default app;
