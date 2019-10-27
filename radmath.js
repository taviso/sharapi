function CreateVector(x, y, z)
{
    var v = Memory.alloc(4 * 3);
    v.add(0 * 4).writeFloat(y);
    v.add(1 * 4).writeFloat(z); // Not a typo, this is the order
    v.add(2 * 4).writeFloat(x);
    return v;
}
