import random


muska = open("C:\\Users\Vilim\Documents\Programi\Phyton\muskaImena.txt", "r")
listaMuskih = []
muskiBrojac = 347

ime = muska.readline()
ime = ime.strip()
while(muskiBrojac != 0):
    listaMuskih.append(ime)
    ime = muska.readline()
    ime = ime.strip()
    muskiBrojac -= 1

muska.close()



zenska = open("C:\\Users\Vilim\Documents\Programi\Phyton\zenskaImena.txt", "r")
listaZenskih = []
zenskiBrojac = 514
zenskoIme = zenska.readline()
zenskoIme = zenskoIme.strip()

while(zenskiBrojac != 0):
    listaZenskih.append(zenskoIme)
    zenskoIme = zenska.readline()
    zenskiBrojac -= 1 
    zenskoIme = zenskoIme.strip()

zenska.close()


prezimena = open("C:\\Users\Vilim\Documents\Programi\Phyton\prezimena.txt", "r")
listaPrezimena = []
prezBrojac = 41
prezime = prezimena.readline()
prezime = prezime.strip()
while(prezBrojac != 0):
    listaPrezimena.append(prezime)
    prezime = prezimena.readline()
    prezBrojac -= 1
    prezime = prezime.strip()

prezimena.close()

print("Unesite broj osoba koje zelite generirati")

broj = input()
broj = int(broj)

id = 11111111
mobitel = 1012013

SQL = open("C:\\Users\Vilim\Documents\Programi\Phyton\SQL.txt", "w")

for i in range (0, broj):
    spol = random.randint(1, 2)
    if(spol == 1): 
        lozinka = str(id)
        lozinka = lozinka[-4:]
        lozinka2 = str(mobitel)
        lozinka2 = lozinka2[-4:]
        trenutnoIme = random.choice(listaMuskih)
        trenutnoPrezime = random.choice(listaPrezimena)
        SQL.write("('" + trenutnoIme + "', '" + trenutnoPrezime + "', " + "'M'"+ ", " + "'09" + str(random.randint(1,9)) + str(mobitel)+ "', '" +
            trenutnoIme + trenutnoPrezime + str(i) + "@gmail.com'"+ ", '" + lozinka + lozinka2 + "', '" + str(random.randint(1929,2003)) + "-" + 
            str(random.randint(1,12)) + "-" + str(random.randint(1,28)) + "')," + "\n")
        mobitel += 1
        id += 1
    else:
        lozinka = str(id)
        lozinka = lozinka[-4:]
        lozinka2 = str(mobitel)
        lozinka2 = lozinka2[-4:]
        trenutnoIme = random.choice(listaZenskih)
        trenutnoPrezime = random.choice(listaPrezimena)
        SQL.write("('" + trenutnoIme + "', '" + trenutnoPrezime + "', " + "'Z'"+ ", " + "'09" + str(random.randint(1,9)) + str(mobitel)+ "', '" +
            trenutnoIme + trenutnoPrezime + str(i) + "@gmail.com'"+ ", '" + lozinka + lozinka2 + "', '" + str(random.randint(1929,2003)) + "-" + 
            str(random.randint(1,12)) + "-" + str(random.randint(1,28)) + "')," + "\n")

        mobitel += 1
        id += 1
 