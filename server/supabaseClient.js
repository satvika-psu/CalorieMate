const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
require("dotenv").config({ path: "../.env" });

const supabaseUrl = "https://vuxuchslzbmueogaamzt.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
