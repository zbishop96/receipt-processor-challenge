# Receipt Processor

A basic backend API for processing reward points on receipt data. Receipts are submitted and if valid, persist to an in-memory database.
Points are calculated at submission and stored with the receipt.

## Setup

Build the container with:
```
docker build -t receipt-processor .
```

and start it with:
```
docker run -p 3000:3000 receipt-processor
```

This starts the service on port 3000 of the container and maps it to your local port 3000.

### Endpoint: Process Receipts

* Path: `/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

Description:

The ID returned is the ID that should be passed into `/receipts/{id}/points` to get the number of points the receipt
was awarded. An invalid receipt returns a status code of 400. The body includes the submitted receipt and the Zod error message
that details the issue in schema validation.

Example Response:
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```

Example Error Response:
```json
{ "receipt": { ... }, "error": { ... } }
```

## Endpoint: Get Points

* Path: `/receipts/{id}/points`
* Method: `GET`
* Response: A JSON object containing the number of points awarded.

A simple Getter endpoint that looks up the receipt by the ID and returns an object specifying the points awarded. If the
specified ID does not exist, the ID is returned with a status code of 404.

Example Response:
```json
{ "points": 32 }
```
Example Error Response:
```json
{ "id": "8759a05f-fb93-49fb-b53e-54e08917ca45" }
```

---

# Design Decisions

I chose NestJS as my framework because it is more aimed at backend / api development than many of the other JS frameworks.
Nest's documentation is fairly easy to follow and the routing is incredible simple. Nest is also OOP-leaning which in this
case worked well.

I chose to calculate the points for a receipt on submission rather than retrieval for a couple reasons. First, the points
are static per receipt. There's currently no way for the receipt data to change which would affect the points calculated.
This meant I can calculate the points once and store them with the receipt instead of calculating them every time they are
requested. Secondly, if this needed to scale to a significant amount of traffic, it would be possible to modify the current
process so that calculations are done separate from the request. The user would submit a receipt, it would be validated and
stored, and the user would get a 201 response. The receipt would then be added to a queue for another service to calculate
points and add that to the db entry.

While usually unnecessary for small projects / assessments like this, I chose to add Zod, an npm package for typescript that
does runtime schema validation. It makes it significantly easier to ensure the data submitted to an API endpoint is the right
form. It also allows for constraints on properties and types so that I can ensure a receipt actually has items or that the retailer
is not an empty string.

