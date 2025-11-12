class Unit {
  constructor({ id = null, name = 'Unit', tier = 1, attack = 1, health = 5, speed = 1, mergeTag = null, xp = 0 } = {}) {
    this.id = id || Unit._generateId();
    this.name = name;
    this.tier = tier;
    this.attack = attack;
    this.maxHealth = health;
    this.health = health;
    this.speed = speed;
    this.mergeTag = mergeTag || `tag-${name.toLowerCase()}`;
    this.xp = xp;
    this.isDead = false;
  }

  clone() {
    return new Unit({
      id: null,
      name: this.name,
      tier: this.tier,
      attack: this.attack,
      health: this.maxHealth,
      speed: this.speed,
      mergeTag: this.mergeTag,
      xp: this.xp,
    });
  }

  takeDamage(amount) {
    const dmg = Math.max(0, amount || 0);
    this.health -= dmg;
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
    }
    return dmg;
  }

  heal(amount) {
    const value = Math.max(0, amount || 0);
    this.health = Math.min(this.maxHealth, this.health + value);
    if (this.health > 0) this.isDead = false;
  }

  reviveToFull() {
    this.health = this.maxHealth;
    this.isDead = false;
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      tier: this.tier,
      attack: this.attack,
      health: this.health,
      maxHealth: this.maxHealth,
      speed: this.speed,
      mergeTag: this.mergeTag,
      xp: this.xp,
      isDead: this.isDead,
    };
  }

  static from(data = {}) {
    return new Unit({
      id: data.id || null,
      name: data.name || 'Unit',
      tier: data.tier || 1,
      attack: data.attack || 1,
      health: data.maxHealth || data.health || 5,
      speed: data.speed || 1,
      mergeTag: data.mergeTag || `tag-${(data.name || 'unit').toLowerCase()}`,
      xp: data.xp || 0,
    });
  }

  static _generateId() {
    Unit._lastId = (Unit._lastId || 0) + 1;
    return Unit._lastId;
  }
}

export default Unit;