// Base data for the Tudor family tree.
// People are stored as an object (id -> person). The tree structure describes
// how people are laid out (couples, children, multiple spouses).
// This file is the fallback; edits made by the admin are stored in Firebase.

export const BASE_PEOPLE = {
  "elizabeth-york": {
    "name": "Elizabeth of York",
    "gender": "female",
    "initial": "E",
    "img": "images/elizabeth-of-york.webp",
    "sub": "Queen consort of England · 11 February 1466 – 11 February 1503",
    "tags": [
      "Daughter of Edward IV",
      "Mother of Henry VIII",
      "Founded the Tudor dynasty"
    ],
    "body": "\n      <p>Elizabeth of York was the eldest daughter of King <strong>Edward IV</strong> and Elizabeth Woodville. As a Yorkist princess she was at the centre of the Wars of the Roses, and at one point was declared heir of the rival Yorkist claim.</p>\n      <p>In <strong>1486</strong> she married <strong>Henry VII</strong>, the first Tudor king. The marriage united the rival Houses of <strong>York and Lancaster</strong> and helped end decades of civil war; their badge combined the white rose of York with the red rose of Lancaster.</p>\n      <p>As queen she was admired for her kindness and dignity. She died in childbirth in 1503, on her 37th birthday, having borne seven children — among them the future Henry VIII.</p>",
    "dates": "1466–1503",
    "role": "Queen consort",
    "badge": {
      "icon": "👑",
      "title": "Queen consort"
    }
  },
  "henry7": {
    "name": "Henry VII",
    "gender": "male",
    "initial": "H",
    "img": "images/henry-vii.webp",
    "sub": "King of England, founder of the House of Tudor · 28 January 1457 – 21 April 1509",
    "tags": [
      "Reigned 1485–1509",
      "Won Bosworth Field",
      "Restored royal finances"
    ],
    "body": "\n      <p><strong>Henry VII</strong> was born at Pembroke Castle in Wales, a descendant of the Lancastrian line through his mother, Margaret Beaufort.</p>\n      <p>On <strong>22 August 1485</strong> he defeated Richard III at the <strong>Battle of Bosworth Field</strong> — the last great battle of the Wars of the Roses — and became the first king of the <strong>House of Tudor</strong>.</p>\n      <p>His marriage to Elizabeth of York (1486) united the warring factions. As king he restored stability and royal finances after years of civil war, ruling carefully until his death in 1509. He was succeeded by his son, Henry VIII.</p>",
    "dates": "1457–1509",
    "role": "King of England",
    "monarch": true,
    "badge": {
      "icon": "👑",
      "title": "King of England"
    }
  },
  "arthur": {
    "name": "Arthur, Prince of Wales",
    "gender": "male",
    "initial": "A",
    "sub": "Heir to the throne · 20 September 1486 – 2 April 1502",
    "tags": [
      "Eldest son of Henry VII",
      "Married Catherine of Aragon",
      "Died aged 15"
    ],
    "body": "\n      <p><strong>Arthur</strong> was the eldest son of Henry VII and Elizabeth of York, born just a few months after his father won the crown. He was named king-in-waiting and Prince of Wales.</p>\n      <p>In <strong>1501</strong> he married the Spanish princess <strong>Catherine of Aragon</strong> to seal an alliance with Spain. The young couple moved to Wales, where Arthur died only five months later, aged 15 — probably of a fever such as the \"sweating sickness\".</p>\n      <p>His death changed the course of history: his younger brother <strong>Henry</strong> became heir and later married Catherine himself, as <strong>Henry VIII</strong> — the marriage whose annulment broke England from Rome.</p>",
    "dates": "1486–1502",
    "role": "Heir apparent",
    "badge": {
      "icon": "🕯",
      "title": "Died young"
    }
  },
  "margaret": {
    "name": "Margaret Tudor",
    "gender": "female",
    "initial": "M",
    "sub": "Queen of Scots · 28 November 1489 – 18 October 1541",
    "tags": [
      "Wife of James IV of Scotland",
      "Mother of James V",
      "Grandmother of Mary, Queen of Scots"
    ],
    "body": "\n      <p><strong>Margaret Tudor</strong>, elder sister of Henry VIII, married King <strong>James IV of Scotland</strong> in 1503 — a union meant to bring peace between England and Scotland.</p>\n      <p>She was mother of <strong>James V of Scotland</strong> and grandmother of <strong>Mary, Queen of Scots</strong>. Through this line, Margaret's descendants — the <strong>Stuarts</strong> — eventually inherited the English throne: in 1603, James VI of Scotland became James I of England, uniting the crowns.</p>\n      <p>After James IV's death at Flodden (1513), her remarriages caused political scandal in Scotland, and she spent much of her later life in conflict with Scottish nobles.</p>",
    "dates": "1489–1541",
    "role": "Queen of Scots",
    "badge": {
      "icon": "👑",
      "title": "Queen of Scots"
    }
  },
  "henry8": {
    "name": "Henry VIII",
    "gender": "male",
    "initial": "H",
    "img": "images/henry-viii.webp",
    "sub": "King of England · 28 June 1491 – 28 January 1547",
    "tags": [
      "Reigned 1509–1547",
      "Six wives",
      "Broke with Rome"
    ],
    "body": "\n      <p><strong>Henry VIII</strong> was the second son of Henry VII — he became heir only after the death of his brother Arthur. Tall, athletic and highly educated, he became one of England's most famous and fearsome kings.</p>\n      <p>He married <strong>six times</strong>; his quest for a male heir led him to annul his first marriage and, in the <strong>Act of Supremacy (1534)</strong>, to declare himself head of the <strong>Church of England</strong>, breaking with the Pope and Rome.</p>\n      <p>Three of his wives bore him children, and all three became monarchs of England in turn: <strong>Mary I</strong>, <strong>Elizabeth I</strong> and <strong>Edward VI</strong>. (His other wives were Anne of Cleves, Catherine Howard and Catherine Parr.) He was buried next to Jane Seymour at Windsor Castle.</p>",
    "dates": "1491–1547",
    "role": "King of England",
    "monarch": true,
    "badge": {
      "icon": "👑",
      "title": "King of England"
    }
  },
  "mary-tudor": {
    "name": "Mary Tudor",
    "gender": "female",
    "initial": "M",
    "sub": "Queen of France, then Duchess of Suffolk · 18 March 1496 – 25 June 1533",
    "tags": [
      "Queen of France 1514–1515",
      "Sister of Henry VIII",
      "Grandmother of Lady Jane Grey"
    ],
    "body": "\n      <p><strong>Mary Tudor</strong>, younger sister of Henry VIII, was famous in her time for her beauty and spirited character.</p>\n      <p>In <strong>1514</strong> she became <strong>Queen of France</strong> as the second wife of the aging King <strong>Louis XII</strong>; when he died the following year, she secretly married her love, <strong>Charles Brandon, Duke of Suffolk</strong>, without her brother's permission — Henry VIII was furious, but eventually forgave them.</p>\n      <p>Her granddaughter was <strong>Lady Jane Grey</strong>, the \"nine days' queen\" of 1553. Through her daughter Frances, Mary is also an ancestor of the future Stuart and Hanoverian lines.</p>",
    "dates": "1496–1533",
    "role": "Queen of France",
    "badge": {
      "icon": "👑",
      "title": "Queen of France"
    }
  },
  "catherine": {
    "name": "Catherine of Aragon",
    "gender": "female",
    "initial": "C",
    "img": "images/catherine-of-aragon.webp",
    "sub": "First wife of Henry VIII · 16 December 1485 – 7 January 1536",
    "tags": [
      "Spanish infanta",
      "Married Henry in 1509",
      "Mother of Mary I"
    ],
    "body": "\n      <p><strong>Catherine of Aragon</strong> was a Spanish princess, the youngest daughter of the famous \"Catholic Monarchs\" <strong>Ferdinand II of Aragon</strong> and <strong>Isabella I of Castile</strong> — the kings who sponsored Columbus.</p>\n      <p>She first came to England to marry Prince <strong>Arthur</strong>, Henry VII's heir, in 1501. After Arthur's death she married his brother <strong>Henry VIII</strong> in 1509. She was queen for <strong>24 years</strong>, pious, well-educated and respected.</p>\n      <p>When she failed to produce a surviving male heir, Henry sought an annulment. Catherine refused, appealing to Rome; the resulting crisis led Henry to break with the Catholic Church. Their marriage was declared void in 1533. Her daughter Mary later became Queen Mary I.</p>",
    "dates": "1485–1536",
    "role": "1st wife"
  },
  "anne": {
    "name": "Anne Boleyn",
    "gender": "female",
    "initial": "A",
    "img": "images/anne-boleyn.webp",
    "sub": "Second wife of Henry VIII · c. 1501/1507 – 19 May 1536",
    "tags": [
      "Mother of Elizabeth I",
      "Key figure of the Reformation",
      "Executed 1536"
    ],
    "body": "\n      <p><strong>Anne Boleyn</strong> grew up at the French court and became one of the most influential and controversial women in English history. Her relationship with Henry VIII lasted more than seven years before they married in <strong>1533</strong> (in secret, in January).</p>\n      <p>Her marriage accelerated the <strong>English Reformation</strong>: to annul Henry's first marriage, England broke with Rome. In September 1533 she gave birth to <strong>Elizabeth</strong>, the future Elizabeth I — but she never produced the son Henry wanted.</p>\n      <p>Accused of adultery, treason and incest on dubious charges, Anne was imprisoned in the Tower of London and <strong>executed on 19 May 1536</strong>. Her marriage to Henry lasted barely three years; her daughter would become England's greatest queen.</p>",
    "dates": "c. 1501–1536",
    "role": "2nd wife",
    "badge": {
      "icon": "⚔",
      "title": "Executed 1536"
    }
  },
  "jane": {
    "name": "Jane Seymour",
    "gender": "female",
    "initial": "J",
    "img": "images/jane-seymour.webp",
    "sub": "Third wife of Henry VIII · c. 1508 – 24 October 1537",
    "tags": [
      "Only wife buried as queen",
      "Mother of Edward VI",
      "Died after childbirth"
    ],
    "body": "\n      <p><strong>Jane Seymour</strong> was a lady-in-waiting to Henry's previous queens. She married the king on <strong>30 May 1536</strong>, just eleven days after the execution of Anne Boleyn.</p>\n      <p>On <strong>12 October 1537</strong> she finally gave Henry what he desired above all: a living legitimate son, <strong>Edward</strong>. Tragically, Jane died <strong>twelve days later</strong>, almost certainly from complications of childbirth (puerperal fever).</p>\n      <p>Henry regarded her as his \"true wife\": he was buried beside her at Windsor Castle, and her son reigned after him as King Edward VI.</p>",
    "dates": "c. 1508–1537",
    "role": "3rd wife"
  },
  "mary1": {
    "name": "Mary I",
    "gender": "female",
    "initial": "M",
    "img": "images/mary-i.webp",
    "sub": "Queen of England · 18 February 1516 – 17 November 1558",
    "tags": [
      "First queen regnant",
      "Daughter of Henry & Catherine",
      "Married Philip II of Spain"
    ],
    "body": "\n      <p><strong>Mary I</strong> was the only surviving child of Henry VIII and <strong>Catherine of Aragon</strong>. Declared illegitimate when her parents' marriage was annulled, she was restored to the succession by her half-brother Edward VI's will.</p>\n      <p>In <strong>1553</strong> she became the <strong>first woman to rule England in her own right</strong> (queen regnant). A devout Catholic, she tried to reverse the Protestant Reformation: she married King <strong>Philip II of Spain</strong> and had about <strong>280 Protestants burned</strong> for heresy — which earned her the nickname <strong>\"Bloody Mary\"</strong>.</p>\n      <p>She lost Calais, England's last possession in France, and died childless in 1558. She was succeeded by her half-sister Elizabeth I.</p>",
    "dates": "1516–1558",
    "role": "Queen regnant",
    "monarch": true,
    "badge": {
      "icon": "👑",
      "title": "Queen regnant"
    }
  },
  "elizabeth1": {
    "name": "Elizabeth I",
    "gender": "female",
    "initial": "E",
    "img": "images/elizabeth-i.webp",
    "sub": "Queen of England · 7 September 1533 – 24 March 1603",
    "tags": [
      "Reigned 1558–1603",
      "\"The Virgin Queen\"",
      "Defeat of the Spanish Armada"
    ],
    "body": "\n      <p><strong>Elizabeth I</strong>, daughter of Henry VIII and <strong>Anne Boleyn</strong>, is often considered England's greatest monarch. Educated superbly in languages and statecraft, she survived imprisonment under her sister Mary I before ascending the throne in <strong>1558</strong>, aged 25.</p>\n      <p>She established a careful <strong>Protestant settlement</strong> (the Elizabethan Religious Settlement of 1559) and ruled for <strong>44 years</strong> in a golden age of English culture — the era of Shakespeare, Marlowe and Spencer.</p>\n      <p>In <strong>1588</strong> England defeated the invasion fleet of Philip II's <strong>Spanish Armada</strong>, securing Protestant England's independence. Nicknamed <strong>\"The Virgin Queen\"</strong> and <strong>\"Gloriana\"</strong>, she never married and died childless in 1603 — the <strong>last Tudor monarch</strong>.</p>",
    "dates": "1533–1603",
    "role": "Queen regnant",
    "monarch": true,
    "badge": {
      "icon": "👑",
      "title": "Queen regnant"
    }
  },
  "edward6": {
    "name": "Edward VI",
    "gender": "male",
    "initial": "E",
    "img": "images/edward-vi.webp",
    "sub": "King of England · 12 October 1537 – 6 July 1553",
    "tags": [
      "Reigned 1547–1553",
      "First Protestant king",
      "Died aged 15"
    ],
    "body": "\n      <p><strong>Edward VI</strong> was the beloved only legitimate son of Henry VIII and <strong>Jane Seymour</strong>, born at Hampton Court Palace. He became king in <strong>1547</strong>, aged just <strong>nine</strong>, with Lord Somerset (then the Duke of Northumberland) ruling as protector.</p>\n      <p>Raised firmly <strong>Protestant</strong>, Edward's government pushed the Reformation further: the <strong>Book of Common Prayer</strong> (1549) made English the language of worship, and altars replaced Catholic-style Masses.</p>\n      <p>Frail and often ill, Edward died aged <strong>15</strong>, probably of tuberculosis. In his will he tried to exclude his Catholic half-sister Mary, naming the Protestant <strong>Lady Jane Grey</strong> as his heir — a scheme that failed after only nine days.</p>",
    "dates": "1537–1553",
    "role": "King of England",
    "monarch": true,
    "badge": {
      "icon": "👑",
      "title": "King of England"
    }
  }
};

export const BASE_TREE = {
  "id": "henry7",
  "spouses": [
    {
      "id": "elizabeth-york",
      "side": "left",
      "married": "♥ m. 1486",
      "children": [
        {
          "id": "arthur",
          "spouses": []
        },
        {
          "id": "margaret",
          "spouses": []
        },
        {
          "id": "henry8",
          "note": "3 of his 6 wives — those who had children",
          "spouses": [
            {
              "id": "catherine",
              "side": "left",
              "married": "♥ m. 1509",
              "children": [
                {
                  "id": "mary1",
                  "spouses": []
                }
              ]
            },
            {
              "id": "anne",
              "side": "left",
              "married": "♥ m. 1533",
              "children": [
                {
                  "id": "elizabeth1",
                  "spouses": []
                }
              ]
            },
            {
              "id": "jane",
              "side": "left",
              "married": "♥ m. 1536",
              "children": [
                {
                  "id": "edward6",
                  "spouses": []
                }
              ]
            }
          ]
        },
        {
          "id": "mary-tudor",
          "spouses": []
        }
      ]
    }
  ]
};
