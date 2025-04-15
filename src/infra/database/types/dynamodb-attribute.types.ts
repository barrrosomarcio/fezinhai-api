export type DynamoDBString = { S: string };
export type DynamoDBNumber = { N: string };
export type DynamoDBBoolean = { BOOL: boolean };
export type DynamoDBNull = { NULL: true };
export type DynamoDBBinary = { B: Buffer };
export type DynamoDBStringSet = { SS: string[] };
export type DynamoDBNumberSet = { NS: string[] };
export type DynamoDBBinarySet = { BS: Buffer[] };
export type DynamoDBList = { L: DynamoDBValue[] };
export type DynamoDBMap = { M: Record<string, DynamoDBValue> };

export type DynamoDBValue =
  | DynamoDBString
  | DynamoDBNumber
  | DynamoDBBoolean
  | DynamoDBNull
  | DynamoDBBinary
  | DynamoDBStringSet
  | DynamoDBNumberSet
  | DynamoDBBinarySet
  | DynamoDBList
  | DynamoDBMap;

export type DynamoDBAttributeMap = Record<string, DynamoDBValue>; 