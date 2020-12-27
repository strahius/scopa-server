import { isEmpty, last } from 'lodash';
import { GameState } from 'shared';
import * as redisClient from '../database/redisClient';
import { Room, Player } from '../database/schema';

export async function getRoom(roomName: string) {
  const room = await redisClient.getRoom(roomName);
  return room;
}

export async function addRoom(room: Room) {
  await redisClient.setRoom(room.name, room);
}

export async function addPlayer(roomName: string, player: Player) {
  const room = await getRoom(roomName);

  room.players.push(player);

  await redisClient.setRoom(roomName, room);
}

export async function addGameState(roomName: string, state: GameState) {
  const room = await getRoom(roomName);
  room.states.push(state);

  await redisClient.setRoom(roomName, room);
}

export async function getRoomState(roomName: string): Promise<GameState | undefined> {
  const room = await redisClient.getRoom(roomName);

  if (isEmpty(room.states)) {
    return undefined;
  }

  return last(room.states);
}
