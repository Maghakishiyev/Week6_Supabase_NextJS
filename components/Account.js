import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "./Avatar";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState(null);
  const [first_name, setfirst_name] = useState(null);
  const [last_name, setlast_name] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [doc_url, set_Doc_url] = useState(null);
  const [created_at, setcreated_at] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(
          `first_name, last_name, doc_url, phone, country, city, created_at`
        )
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setcreated_at(data.created_at);
        setfirst_name(data.first_name);
        set_Doc_url(data.doc_url);
        setlast_name(data.last_name);
        setPhone(data.phone);
        setCity(data.city);
        setCountry(data.country);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ first_name, website, doc_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        first_name,
        last_name,
        phone,
        country,
        city,
        doc_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  console.log(`Profile of ${first_name} was created: ${created_at}`);
  return (
    <div className="form-widget">
      <div>
        <Avatar
          url={doc_url}
          size={150}
          onUpload={(url) => {
            set_Doc_url(url);
            updateProfile({
              first_name,
              last_name,
              phone,
              country,
              city,
              doc_url: url,
            });
          }}
        />
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          value={phone || ""}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          value={first_name || ""}
          onChange={(e) => setfirst_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          value={last_name || ""}
          onChange={(e) => setlast_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ""}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ first_name, doc_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
