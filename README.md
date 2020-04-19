# Our own type system

A compiler which checks types for 3 scenarios:

1. Issue with un-compatible types on declaration and expression

```javascript
fn("craig-string"); // throw with string vs number
function fn(a: number) {}
```

2. Issue with unknown type on declaration and expression

```javascript
fn("craig-string"); // throw with string vs ?
function fn(a: made_up_type) {} // throw with bad type
```

3. Issue with property name

```javascript
interface Person {
  name: string;
}
fn({ nam: "craig" }); // throw with "nam" vs "name"
function fn(a: Person) {}
```
