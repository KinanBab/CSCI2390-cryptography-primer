```neptune[language=javascript,inject=true]
(function () {
  let script = document.createElement('script');
  script.setAttribute('src', '/dist/jiff-client.js');
  document.head.appendChild(script);
  
  window.randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}());
```

## Additive secret sharing

```neptune[frame=1,title=Insecure&nbsp;Scheme]
function share(x, n) {
  let shares = [];
  let sum = 0;
  for (let i = 0; i < n-1; i++) {
    let r = randomNumber(-100, 100);
    sum += r;
    shares.push(r);
  }
  
  shares.push(x - sum);
  return shares;
}

function open(shares) {
  return shares.reduce(function (sum, share) { return sum + share }, 0);
}

let shares = share(5, 3);
Console.log(shares, open(shares));
shares = share(5, 2);
Console.log(shares, open(shares));
shares = share(10, 5);
Console.log(shares, open(shares));
```

```neptune[frame=1,title=Secure&nbsp;Additive&nbsp;Secret&nbsp;Sharing,scope=33]
const MOD = 128;
function mod(v) {
  return (v + MOD) % MOD;
}

function share(x, n) {
  let shares = [];
  let sum = 0;
  for (let i = 0; i < n-1; i++) {
    let r = Math.floor(Math.random() * MOD);
    sum = mod(sum + r);
    shares.push(r);
  }
  
  shares.push(mod(x - sum));
  return shares;
}

function open(shares, prime) {
  return shares.reduce(function (sum, share) { return mod(sum + share) }, 0);
}

let shares = share(5, 3);
Console.log(shares, open(shares));
shares = share(5, 2);
Console.log(shares, open(shares));
shares = share(10, 5);
Console.log(shares, open(shares));
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```

## Adding many secrets.
```neptune[frame=frame3,scope=33]
let sharesOf5 = share(5, 3);
let sharesOf10 = share(10, 3);
let sharesOf15 = share(15, 3);

let sharesOfSum = [
  // Party 1 does this.
  sharesOf5[0] + sharesOf10[0] + sharesOf15[0],

  // Party 2 does this.
  sharesOf5[1] + sharesOf10[1] + sharesOf15[1],

  // Party 3 does this.
  sharesOf5[2] + sharesOf10[2] + sharesOf15[2]
];

// Now they combine everything.
Console.log(open(sharesOfSum));
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```


## MPC example with JIFF


```neptune[title=Party&nbsp;1,frame=frame2,scope=1]
async function onConnect() {
  let options = ['IPA', 'Lager', 'Stout', 'Pilsner'];
  let input = [1, 0, 0, 0];

  let results = [];
  for (let i = 0; i < options.length; i++) {
    let ithOptionShares = jiffClient.share(input[i]);
    let ithOptionResult = ithOptionShares[1].sadd(ithOptionShares[2]).sadd(ithOptionShares[3]);
    results.push(await jiffClient.open(ithOptionResult));
  }

  Console.log('options', options);
  Console.log('results', results);
}

let options = { party_count: 3, crypto_provider: true, onConnect: onConnect };
let jiffClient = new JIFFClient('http://localhost:9111', 'our-setup-application', options);
```

```neptune[title=Party&nbsp;2,frame=frame2,scope=2]
async function onConnect() {
  let options = ['IPA', 'Lager', 'Stout', 'Pilsner'];
  let input = [1, 0, 0, 0];

  let results = [];
  for (let i = 0; i < options.length; i++) {
    let ithOptionShares = jiffClient.share(input[i]);
    let ithOptionResult = ithOptionShares[1].sadd(ithOptionShares[2]).sadd(ithOptionShares[3]);
    results.push(await jiffClient.open(ithOptionResult));
  }

  Console.log('options', options);
  Console.log('results', results);
}

let options = { party_count: 3, crypto_provider: true, onConnect: onConnect };
let jiffClient = new JIFFClient('http://localhost:9111', 'our-setup-application', options);
```

```neptune[title=Party&nbsp;3,frame=frame2,scope=3]
async function onConnect() {
  let options = ['IPA', 'Lager', 'Stout', 'Pilsner'];
  let input = [0, 0, 1, 0];

  let results = [];
  for (let i = 0; i < options.length; i++) {
    let ithOptionShares = jiffClient.share(input[i]);
    let ithOptionResult = ithOptionShares[1].sadd(ithOptionShares[2]).sadd(ithOptionShares[3]);
    results.push(await jiffClient.open(ithOptionResult));
  }

  Console.log('options', options);
  Console.log('results', results);
}

let options = { party_count: 3, crypto_provider: true, onConnect: onConnect };
let jiffClient = new JIFFClient('http://localhost:9111', 'our-setup-application', options);
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```

## Playground


```neptune[title=Party&nbsp;1,frame=frame4,scope=1]
async function playground() {
  const input = 10;
  let shares = jiffClient.share(input);
  let product = shares[1].smult(shares[2]).smult(shares[3]);
  let result = product.cgt(100);
  Console.log(await jiffClient.open(result));
}
playground();
```

```neptune[title=Party&nbsp;2,frame=frame4,scope=2]
async function playground() {
  const input = 5;
  let shares = jiffClient.share(input);
  let product = shares[1].smult(shares[2]).smult(shares[3]);
  let result = product.cgt(100);
  Console.log(await jiffClient.open(result));
}
playground();
```

```neptune[title=Party&nbsp;3,frame=frame4,scope=3]
async function playground() {
  const input = 4;
  let shares = jiffClient.share(input);
  let product = shares[1].smult(shares[2]).smult(shares[3]);
  let result = product.cgt(100);
  Console.log(await jiffClient.open(result));
}
playground();
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```
```neptune[inject=true,language=html]
<br><br><br><br><br><br><br><br><br><br><br>
```
