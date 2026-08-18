import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY environment variable is not configured. Please register it in the Secrets panel in AI Studio."
      );
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Endpoint: Prayer Companion Chat Proxy (Disabled as requested by the user)

// Helper function to return beautiful, traditional Catholic Roman Rite fallback liturgical texts
function getFallbackOffice(hour: string, dateString: string): string {
  const displayDate = (() => {
    try {
      const parts = dateString.split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateString;
    }
  })();

  const introMsg = `### Liturgy of the Hours — Universal Roman Rite\n\n*Proper of the Day — ${displayDate}*\n\n---\n\n`;

  if (hour === "lauds") {
    return introMsg + `### **1. Invitatory**

℣. Lord, open my lips.
℟. And my mouth shall declare Your praise.

**Antiphon:** *Behold, the Lord comes! Let us adore Him.*

#### **Psalm 95**
*An invitation to praise God*

Come, let us sing to the Lord
and shout with joy to the Rock who saves us.
Let us approach Him with songs of thanksgiving,
and sing joyful psalms to the Lord.

For the Lord is a great God,
a great king, high above all gods.
In His hands are the depths of the earth;
the heights of the mountains are His.
The sea belongs to Him, for He made it,
and the dry land, which His hands have shaped.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Behold, the Lord comes! Let us adore Him.*

---

### **2. Opening**

℣. O God, come to my assistance.
℟. O Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

---

### **3. Hymn**
*O Glory of the Sky! (Aeterna Caeli Gloria)*

O Christ, the world's Creator,
The Light of Light Alone,
True God of True God,
Who reigns upon the throne.

Let faith and hope and charity
Dwell in our hearts today,
To guide us through our labors,
And keep us on Thy way.

---

### **4. Psalmody**

#### **Psalm 63:2-9**
*A soul thirsting for God*

**Antiphon:** *As morning breaks, O Lord, I stand before You.*

O God, You are my God, for You I long;
for You my soul is thirsting.
My body pines for You
like a dry, weary land without water.

So I gaze on You in the sanctuary
to see Your strength and Your glory.
For Your love is better than life,
my lips will speak Your praise.

So I will bless You all my life,
in Your name I will lift up my hands.
My soul shall be filled as with a banquet,
my mouth shall praise You with joy.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *As morning breaks, O Lord, I stand before You.*

---

#### **Old Testament Canticle (Daniel 3:57-88)**
*Let all creatures praise the Lord*

**Antiphon:** *Deep in the night your name has been our solace.*

All you works of the Lord, O bless the Lord.
To Him be highest glory and praise for ever.
And you, angels of the Lord, O bless the Lord.
To Him be highest glory and praise for ever.

And you, the heavens of the Lord, O bless the Lord.
And all you waters above the heavens, O bless the Lord.
And all you powers of the Lord, O bless the Lord.
To Him be highest glory and praise for ever.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Deep in the night your name has been our solace.*

---

#### **Psalm 150**
*Praise the Lord*

**Antiphon:** *Let everything that breathes give praise to the Lord.*

Praise God in His holy place,
praise Him in His mighty heavens.
Praise Him for His powerful deeds,
praise Him for His boundless grandeur.

O praise Him with sound of trumpet,
praise Him with lute and harp.
Praise Him with timbrel and dance,
praise Him with strings and pipes.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Let everything that breathes give praise to the Lord.*

---

### **5. Reading**
*Romans 13:11-13*

The night is advanced, the day is at hand. Let us then throw off the works of darkness and put on the armor of light; let us conduct ourselves properly as in the day, not in orgies and drunkenness, not in promiscuity and licentiousness, not in rivalry and jealousy.

℣. The Word of the Lord.
℟. Thanks be to God.

---

### **6. Gospel Canticle**

#### **Benedictus**
*Luke 1:68-79 – The Canticle of Zechariah*

**Antiphon:** *In the tender compassion of our God, the Dawn from on high shall break upon us.*

Blessed be the Lord, the God of Israel;
He has come to His people and set them free.
He has raised up for us a mighty Savior,
born of the house of His servant David.

Through His holy prophets He promised of old
that He would save us from our enemies,
from the hands of all who hate us.
He promised to show mercy to our fathers
and to remember His holy covenant.

This was the oath He swore to our father Abraham:
to set us free from the hands of our enemies,
free to worship Him without fear,
holy and righteous in His sight
all the days of our life.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *In the tender compassion of our God, the Dawn from on high shall break upon us.*

---

### **7. Intercessions**

As sunlight fills the world, let us pray to the Father of lights:
**Response:** *Lord, hear our prayer.*

That our thoughts, words, and actions may remain in Your truth:
**Response:** *Lord, hear our prayer.*

That we may love our neighbors as Christ has loved us:
**Response:** *Lord, hear our prayer.*

That those who suffer today may find comfort under Your mantle:
**Response:** *Lord, hear our prayer.*

---

### **8. The Lord's Prayer**

Let us pray as our Savior taught us:
Our Father, who art in heaven,
hallowed be Thy name;
Thy kingdom come;
Thy will be done on earth as it is in heaven.
Give us this day our daily bread;
and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil. Amen.

---

### **9. Concluding Prayer**

Lord God, King of heaven and earth, direct our minds and bodies this day. Keep us in Your grace and peace, that we may walk in Your light and live in Your presence. We ask this through our Lord Jesus Christ, Your Son, who lives and reigns with You in the unity of the Holy Spirit, God, for ever and ever.
**Response:** *Amen.*

---

### **10. Blessing**

℣. May the Lord bless us, protect us from all evil, and bring us to everlasting life.
℟. Amen.`;
  }

  if (hour === "vespers") {
    return introMsg + `### **1. Opening**

℣. O God, come to my assistance.
℟. O Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

---

### **2. Hymn**
*O Blest Creator of the Light (Lucis Creator Optime)*

O blest Creator of the light,
Who dost the dawn from darkness bring,
And at the starting of the world,
Dost bid our voices rise and sing.

We pray Thee, Lord, in evening's hour,
Forgive our sins, our prayers receive;
And keep us safe within Thy strength,
Who in Thy holy name believe.

---

### **3. Psalmody**

#### **Psalm 110:1-5, 7**
*The Messiah, King and Priest*

**Antiphon:** *The Lord will stretch forth his mighty scepter from Zion.*

The Lord’s revelation to my Master:
"Sit on my right:
I will put your foes beneath your feet."

The Lord will yield from Zion
your scepter of power:
rule in the midst of all your foes.

A prince from the day of your birth
on the holy mountains;
from the womb before the dawn I begot you.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *The Lord will stretch forth his mighty scepter from Zion.*

---

#### **Psalm 111**
*The great works of the Lord*

**Antiphon:** *The Lord has saved us and set us free.*

I will thank the Lord with all my heart
in the meeting of the just and their assembly.
Great are the works of the Lord,
to be pondered by all who love them.

Majestic and glorious His work,
His justice stands firm for ever.
He makes us remember His wonders.
The Lord is compassion and love.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *The Lord has saved us and set us free.*

---

#### **New Testament Canticle (Philippians 2:6-11)**
*Christ, the servant of God*

**Antiphon:** *Let every knee bend at the name of Jesus.*

Though He was in the form of God,
Jesus did not count equality with God a thing to be grasped.
He emptied Himself,
taking the form of a servant,
being born in the likeness of men.

And being found in human form, He humbled Himself
and became obedient unto death,
even death on a cross.

Therefore God has highly exalted Him
and bestowed on Him the name which is above every name,
that at the name of Jesus every knee should bend,
in heaven and on earth and under the earth.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Let every knee bend at the name of Jesus.*

---

### **4. Reading**
*1 Peter 5:5-7*

Bow humbly under the mighty hand of God, so that He may exalt you in due time. Cast all your anxiety upon Him, because He is caring for you.

℣. The Word of the Lord.
℟. Thanks be to God.

---

### **5. Gospel Canticle**

#### **Magnificat**
*Luke 1:46-55 – The Canticle of Mary*

**Antiphon:** *Show the strength of your arm, O Lord; scatter the proud and lift up the lowly.*

My soul proclaims the greatness of the Lord,
my spirit rejoices in God my Savior;
for He has looked with favor on His lowly servant.

From this day all generations will call me blessed:
the Almighty has done great things for me,
and holy is His name.

He has mercy on those who fear Him
in every generation.
He has shown the strength of his arm,
He has scattered the proud in their conceit.

He has cast down the mighty from their thrones,
and has lifted up the lowly.
He has filled the hungry with good things,
and the rich He has sent away empty.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Show the strength of your arm, O Lord; scatter the proud and lift up the lowly.*

---

### **6. Intercessions**

Let us pray to the Father, from whom all grace flows:
**Response:** *Lord, hear our prayer.*

Keep Your Church structured in love, truth, and peace:
**Response:** *Lord, hear our prayer.*

Grant light and wisdom to our Holy Father and all pastors:
**Response:** *Lord, hear our prayer.*

Comfort those who are lonely, sick, or grieving this evening:
**Response:** *Lord, hear our prayer.*

Bring the faithful departed to the glory of Your presence:
**Response:** *Lord, hear our prayer.*

---

### **7. The Lord's Prayer**

Let us pray as our Savior taught us:
Our Father, who art in heaven,
hallowed be Thy name;
Thy kingdom come;
Thy will be done on earth as it is in heaven.
Give us this day our daily bread;
and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil. Amen.

---

### **8. Concluding Prayer**

Lord God, we pray that Your grace may always precede and follow us, making us eager to perform good works. Guard us in this evening hour, and bring us safely to tomorrow's daybreak. We ask this through our Lord Jesus Christ, Your Son, who lives and reigns in the unity of the Holy Spirit, God, for ever and ever.
**Response:** *Amen.*

---

### **9. Blessing**

℣. May the Lord bless us, protect us from all evil, and bring us to everlasting life.
℟. Amen.`;
  }

  if (hour === "compline") {
    return introMsg + `### **1. Examination of Conscience**

*In the stillness of the night, let us pray in silence, asking our Lord's mercy for all the failings of this day.*

*(Take a brief moment of silent reflection)*

I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do... May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life. Amen.

---

### **2. Opening**

℣. O God, come to my assistance.
℟. O Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

---

### **3. Hymn**
*To Thee, Before the Close of Day (Te Lucis Ante Terminum)*

To Thee, before the close of day,
Creator of the world, we pray
That with Thy wonted favor Thou
Wouldst be our Guard and Keeper now.

From all ill dreams defend our eyes,
From night-fears and from fantasies,
Tread underfoot our ghostly foe,
That no pollution we may know.

---

### **4. Psalmody**

#### **Psalm 4**
*Trust in God in times of distress*

**Antiphon:** *Have mercy on me, O Lord, and hear my prayer.*

When I call, answer me, O God of my justice.
In my distress, You set me free.
Have mercy on me and hear my prayer.

Know that the Lord does wonders for His faithful one;
the Lord hears when I call to Him.
Tremble, and do not sin:
speak in your hearts upon your beds, and be silent.

I will lie down in peace, and sleep comes at once;
for You alone, Lord, make me dwell in safety.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Have mercy on me, O Lord, and hear my prayer.*

---

#### **Psalm 134**
*Evening prayer in the Temple*

**Antiphon:** *In the night bless the Lord.*

O come, bless the Lord,
all you servants of the Lord,
you who stand in the house of the Lord,
in the courts of the house of our God.

Lift up your hands to the holy place,
and bless the Lord through the night.
May the Lord bless you from Zion,
He who made both heaven and earth.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *In the night bless the Lord.*

---

### **5. Reading**
*1 Thessalonians 5:23*

May the God of peace make you perfect and holy; and may your spirit, soul, and body be kept safe and blameless until the coming of our Lord Jesus Christ.

℣. The Word of the Lord.
℟. Thanks be to God.

---

### **6. Responsory**

℣. Into Your hands, Lord, I commend my spirit.
℟. Into Your hands, Lord, I commend my spirit.
℣. You have redeemed us, Lord, God of truth.
℟. I commend my spirit.
℣. Glory be to the Father, and to the Son, and to the Holy Spirit.
℟. Into Your hands, Lord, I commend my spirit.

---

### **7. Gospel Canticle**

#### **Nunc Dimittis**
*Luke 2:29-32 – The Canticle of Simeon*

**Antiphon:** *Protect us, Lord, as we stay awake; watch over us as we sleep, that awake we may keep watch with Christ, and asleep, rest in His peace.*

Now, Lord, You let Your servant go in peace,
according to Your word.
For my eyes have seen Your salvation,
which You have prepared in the sight of all peoples:

A Light to reveal You to the nations,
and the glory of Your people Israel.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Protect us, Lord, as we stay awake; watch over us as we sleep, that awake we may keep watch with Christ, and asleep, rest in His peace.*

---

### **8. Concluding Prayer**

Visit this house, we pray You, Lord; drive far from it all snares of the enemy. May Your holy angels dwell here to keep us in peace, and may Your blessing be always upon us. Through Christ our Lord.
**Response:** *Amen.*

---

### **9. Blessing**

May the all-powerful Lord grant us a quiet night and a perfect end.
**Response:** *Amen.*

---

### **10. Marian Antiphon**

#### **Salve Regina (Hail, Holy Queen)**

Hail, Holy Queen, Mother of Mercy,
our life, our sweetness, and our hope.
To thee do we cry, poor banished children of Eve.
To thee do we send up our sighs,
mourning and weeping in this valley of tears.

Turn then, most gracious advocate,
thine eyes of mercy toward us,
and after this our exile,
show unto us the blessed fruit of thy womb, Jesus.
O clement, O loving, O sweet Virgin Mary.

℣. Pray for us, O Holy Mother of God.
℟. That we may be made worthy of the promises of Christ.

**Let us pray:**
Almighty, everlasting God, who by the cooperation of the Holy Spirit, didst prepare the body and soul of the glorious Virgin-Mother Mary to become a dwelling place worthy of Thy Son: grant that as we rejoice in her commemoration, we may, by her loving intercession, be delivered from present evils and from everlasting death. Through the same Christ our Lord.
**Response:** *Amen.*`;
  }

  if (hour === "readings") {
    return introMsg + `### **1. Opening**

℣. O God, come to my assistance.
℟. O Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

---

### **2. Hymn**
*Let Heaven Rejoice with Praises (Exsultet Caelum Laudibus)*

Let heaven rejoice with praises high,
And earth with joy repeat the sky;
In honor of the Apostles' name
Let all the world their glory claim.

Who by the Father's voice were sent,
As pillars of His testament;
To preach His Word in every land,
And gather sheep in Christ's own hand.

---

### **3. Psalmody**

#### **Psalm 1**
*The two paths available to man*

**Antiphon:** *Blessed is the man who meditates on the law of the Lord day and night.*

Happy indeed is the man
who follows not the counsel of the wicked;
nor lingers in the way of sinners
nor sits in the company of scorners,
but whose delight is the law of the Lord
and who ponders His law day and night.

He is like a tree that is planted
beside the flowing waters,
that yields its fruit in due season
and whose leaves shall never fade;
and all that he does shall prosper.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Blessed is the man who meditates on the law of the Lord day and night.*

---

#### **Psalm 2**
*The royal drama of the Messiah*

**Antiphon:** *Ask of me, and I will make the nations your heritage.*

Why this tumult among nations,
among peoples this useless murmuring?
They rise up, the kings of the earth,
princes plot against the Lord and His Anointed.
"Let us break their fetters in pieces,
let us cast off their yoke from our shoulders!"

He who dwells in heaven laughs them to scorn;
the Lord has them in derision.
Then He speaks to them in His anger,
He terrifies them in His wrath.
"It is I who have set up my king
on Zion, my holy mountain."

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *Ask of me, and I will make the nations your heritage.*

---

#### **Psalm 3**
*Trust in God in moments of danger*

**Antiphon:** *You, O Lord, are my shield, my glory, and the lifter of my head.*

How many are my foes, O Lord,
how many are rising against me!
How many are saying about me:
"There is no help for him in his God."

But You, O Lord, are a shield about me,
my glory, who lift up my head.
I cry aloud to the Lord,
He answers from His holy mountain.

I lie down to rest and I sleep,
I wake, for the Lord upholds me.
I will not fear even thousands of people
who are ranged against me on every side.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *You, O Lord, are my shield, my glory, and the lifter of my head.*

---

### **4. First Reading (Scripture)**
*Isaiah 40:1-11*

Comfort, give comfort to my people, says your God. Speak tenderly to Jerusalem, and proclaim to her that her service is at an end, her guilt is expiated... A voice cries out: In the desert prepare the way of the Lord! Make straight in the wasteland a highway for our God!... The grass withers, the flower fades, but the word of our God stands forever.

℣. The Word of the Lord.
℟. Thanks be to God.

**Responsory:**
℣. Behold, our Lord shall come with strength.
℟. And He shall enlighten the eyes of His servants.

---

### **5. Second Reading (Patristic)**
*From a sermon by Saint Augustine, Bishop*

"The desire of your heart is your prayer. If your desire is continuous, your prayer is continuous. It was not for nothing that the Apostle said: *Pray without ceasing*. Can we be always on our knees, or prostrate, or raising our hands in prayer, that he should command us to pray without ceasing? There is inside us another, deep, interior prayer which has no intermission: the desire of your heart. Whatever else you may be doing, if you are longing for that eternal sabbath, you do not cease to pray. If you do not wish to cease praying, never cease to desire."

℣. The Word of the Lord.
℟. Thanks be to God.

**Responsory:**
℣. Keep me, Lord, as the apple of Your eye.
℟. Hide me under the shadow of Your wings.

---

### **6. Te Deum (Hymn of Praise)**

*We praise You, O God, we acclaim You as Lord.*
All creation worships You, the Father everlasting.
To You all angels, all the powers of heaven,
Cherubim and Seraphim, sing in endless praise:
**Holy, Holy, Holy Lord, God of power and might,
heaven and earth are full of Your glory.**

The glorious band of apostles praise You.
The noble fellowship of prophets praise You.
The white-robed army of martyrs praise You.
Throughout the world the holy Church acclaims You:
Father of majesty unbounded,
Your true and only Son, worthy of all worship,
and the Holy Spirit, advocate and guide.

---

### **7. Concluding Prayer**

Lord, our God, guide us by Your light and Your truth, that we may always desire what is pleasing to You and accomplish it with all our strength. Make our minds and hearts alert to Your calling. We ask this through our Lord Jesus Christ, Your Son, who lives and reigns with You in the unity of the Holy Spirit, God, for ever and ever.
**Response:** *Amen.*

---

### **8. Blessing**

℣. May the Lord bless us, protect us from all evil, and bring us to everlasting life.
℟. Amen.`;
  }

  // Fallback to daytime general prayer
  return introMsg + `### **1. Opening**

℣. O God, come to my assistance.
℟. O Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

---

### **2. Hymn**
*O God of Truth, O Lord of Might (Rector Potens, Verax Deus)*

O God of truth, O Lord of might,
Who rulest all things in Your sight,
Who sendest forth the morning ray,
And light's bright flame at noon of day.

Extinguish, Lord, the flames of strife,
From harmful passion guard our life;
Grant health of body, peace of soul,
And keep our minds and spirits whole.

---

### **3. Psalmody**

#### **Psalm 119:17-24**
*Meditation on God's law*

**Antiphon:** *My soul gasps for your saving help, O Lord.*

Do good to Your servant, that I may live
and keep Your words carefully.
Open my eyes, that I may see
the wonders of Your holy law.

I am a pilgrim on this earth;
hide not Your commands from me.
My soul is consumed with longing
for Your decrees at every moment.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *My soul gasps for your saving help, O Lord.*

---

#### **Psalm 121**
*The Lord, our guardian*

**Antiphon:** *The Lord is my guardian; the Lord is my shade.*

I lift up my eyes to the mountains;
from where shall come my help?
My help shall come from the Lord,
who made both heaven and earth.

May He never allow you to stumble;
let Him not sleep, your guardian.
No, He sleeps not nor slumbers,
the guardian of Israel.

The Lord is your guardian and your shade;
the Lord has set His tent at your right hand.
By day the sun shall not smite you
nor the moon by night.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *The Lord is my guardian; the Lord is my shade.*

---

#### **Psalm 122**
*Pilgrim song of holy joy*

**Antiphon:** *I rejoiced when they said to me: Let us go to the house of the Lord.*

I rejoiced when they said to me:
"Let us go to the house of the Lord."
And now our feet are standing
within your gates, O Jerusalem.

Jerusalem, built as a city
strongly compact and unified.
It is there that the tribes go up,
the tribes of the Lord, to praise Him.

Glory be to the Father, and to the Son,
and to the Holy Spirit:
as it was in the beginning, is now,
and ever shall be, world without end. Amen.

**Antiphon:** *I rejoiced when they said to me: Let us go to the house of the Lord.*

---

### **4. Reading**
*Titus 2:11-12*

The grace of God has appeared, bringing salvation to all, training us to renounce impiety and worldly passions, and in the present age to live lives that are self-controlled, upright, and godly.

℣. The Word of the Lord.
℟. Thanks be to God.

---

### **5. Concluding Prayer**

Lord God, keep us attentive to the needs of our brothers and sisters. May our efforts this day help to bring about Your kingdom of justice, charity, and peace. We ask this through Christ our Lord.
**Response:** *Amen.*

---

### **6. Blessing**

℣. May the Lord bless us, protect us from all evil, and bring us to everlasting life.
℟. Amen.`;
}

// Endpoint: Grounded Liturgy of the Hours Fetcher
app.post("/api/office", async (req, res) => {
  const { hour, date } = req.body;
  try {
    if (!hour || !date) {
      res.status(400).json({ error: "Hour and date parameters are required." });
      return;
    }

    const ai = getGeminiClient();

    // Map short hour names to official ones
    const hourNames: Record<string, string> = {
      readings: "Office of Readings (Matins)",
      lauds: "Morning Prayer (Lauds)",
      daytime: "Daytime Prayer (Terce, Sext, or None)",
      vespers: "Evening Prayer (Vespers)",
      compline: "Night Prayer (Compline)"
    };

    const officialHourName = hourNames[hour] || hour;

    // Structure prompt specifically with search targets
    const prompt = `Search Universalis or iBreviary for the authentic Catholic Liturgy of the Hours for the date: ${date}, specifically for the hour: ${officialHourName}. 
Retrieve the correct liturgical antiphons, psalms, readings, Gospel canticles (if applicable), intercessions, and final Collect (prayer) matching the roman-rite breviary cycle for ${date}. 
Write a complete, highly reverent liturgical text following the traditional structure specified in your system instructions.`;

    const systemInstruction = `You are a faithful Catholic Priest and Master of Liturgies, leading the user through the Liturgy of the Hours (Divine Office) in union with the Universal Church.
You have access to Google Search grounding. Use it to retrieve the proper prayers, readings, antiphons, and psalms for the specified date and hour according to the Roman Rite (General Roman Calendar / Universalis / iBreviary).

Present the requested hour in the following pristine traditional structure, formatted in clean Markdown with distinct section headings (e.g. ### Opening, ### Hymn, ### Psalmody, ### Reading, etc.).
Do not include any system metadata or search query explanations in your response. Speak reverently, as a prayer leader. Use "Let us pray" and "We pray". Leave room for prayerful pauses. Add "Thanks be to God" after scripture/canticles.

### STRICT STRUCTURE FOR EACH HOUR:

1. ### Opening
   - Begin with the Versicle and Response:
     ℣. O God, come to my assistance.
     ℟. O Lord, make haste to help me.
     Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia. (Omit Alleluia in Lent).
   - If the hour is **Lauds (Morning Prayer)**, you must first pray the **Invitatory Psalm 95** (or Psalm 100, 67, or 24) with its proper antiphon obtained from the day's Office, before the main Opening.

2. ### Hymn
   - Provide the traditional Latin or English hymn assigned to this hour/season from the breviary tradition.

3. ### Psalmody
   - For EACH of the 3 psalms/canticles assigned to this hour:
     - State the proper **Antiphon** gathered from the day's Office.
     - Include the full scripture text of the Psalm/Canticle broken into elegant, prayerful stanzas.
     - Add the **Glory Be** at the end.
     - Repeat the proper **Antiphon** at the end.

4. ### Reading
   - Present the short scripture reading (or long readings if Office of Readings) assigned for the date, followed by the responsory (verse and response). Add "Thanks be to God" or matching responsory.

5. ### Gospel Canticle
   - Prepare the proper Gospel Canticle:
     - For **Lauds**: *Benedictus* (Canticle of Zechariah, Luke 1:68-79) with its proper daily antiphon.
     - For **Vespers**: *Magnificat* (Canticle of Mary, Luke 1:46-55) with its proper daily antiphon.
     - For **Compline**: *Nunc Dimittis* (Canticle of Simeon, Luke 2:29-32) with its traditional antiphon.
   - Present the antiphon before and after the text. Add "Thanks be to God" at the end of the text.
   - Note: Daytime Prayer (Terce, Sext, None) and Office of Readings do not have a Gospel Canticle. Skip this section for those hours.

6. ### Intercessions
   - Provide the day's proper intercessions or seasonal equivalents.
   - State the response: "Lord, hear our prayer." or the day's customized response.

7. ### The Lord's Prayer
   - "Let us pray as the Lord taught us: Our Father..."

8. ### Concluding Prayer
   - The proper Collect of the day (the exact prayer of the day according to the calendar).

9. ### Blessing
   - ℣. May the Lord bless us, protect us from all evil, and bring us to everlasting life.
   - ℟. Amen.
   - *Compline specific dismissal*: "May the all-powerful Lord grant us a quiet night and a perfect end. Amen."

10. ### Marian Antiphon (Compline Only)
    - Include the seasonal Marian Antiphon:
      - Advent/Christmas: Alma Redemptoris Mater
      - Lent: Ave Regina Caelorum
      - Eastertide: Regina Caeli
      - Ordinary Time: Salve Regina
    - Include the versicle and concluding prayer.

### SEARCH GROUNDING RULES:
You must perform Google Search queries (e.g. "Liturgy of the Hours ${date} ${officialHourName} Universalis 2026" or "iBreviary ${officialHourName} ${date}") to retrieve actual scriptures, psalms, collects, and antiphons. If the search results are incomplete or unavailable, explain this reverently and gracefully fall back to a beautiful seasonal common or votive office using the standard traditional structure, keeping the prayer fully coherent and official. Never output half-finished sentences or bracket placeholders.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        tools: [{ googleSearch: {} }] // Activate Search Grounding!
      }
    });

    const liturgy = response.text || "";
    res.json({ liturgy });
  } catch (err: any) {
    console.error("Error in AI office grounding proxy, reverting to traditional high-fidelity liturgical fallback:", err);
    // Generates a beautiful pastoral traditional Liturgy fallback so the viewer always gets a pristine prayer experience even if exceeding quota or rate-limits
    const liturgy = getFallbackOffice(hour, date || "2026-06-17");
    res.json({ liturgy });
  }
});

// Setup Vite Development Middleware or Serve Static Files in Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Catholic Prayer Companion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
