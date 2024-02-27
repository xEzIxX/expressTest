import '../config/env.js'

import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { BoardService } from '../services/board.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

export const boardRouter = express.Router()
const boardService = new BoardService()

boardRouter.get(
    // 리스트조회
    '/',
    wrapper(async (req, res) => {
        const foundAllBoard = await boardService.findAllBoard() // 모든 게시글 반환 서비스 함수

        if (foundAllBoard.result === true) {
            return res.status(200).render('board/list.ejs', foundAllBoard)
            // return res.send(foundAllBoard)
        } else {
            return res.status(500).send(foundAllBoard)
        }
    })
)

boardRouter.get(
    // 검색
    '/search',
    wrapper(async (req, res) => {
        const queryDto = {
            q: req.query.q,
            sort: req.query.sort,
        }
        const searchedList = await boardService.searchList(queryDto)

        if (searchedList.result === true) {
            return res.render('board/list.ejs', searchedList)
            // return res.send(searchedList)
        } else {
            return res.status(500).send(searchedList)
        }
    })
)

/* [ /board/form ] 게시글 작성 */

boardRouter.get(
    // 게시글 작성 폼 조회
    '/form',
    wrapper(async (req, res) => {
        // console.log(req.userId)
        return res.render('board/form.ejs')
    })
)

boardRouter.post(
    // 작성한 게시글 저장
    '/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        console.log(req.userId)
        const newBoardDto = {
            title: req.body.title,
            content: req.body.content,
            userId: req.userId,
        }

        const createdBoard = await boardService.createBoard(newBoardDto) // 작성한 글 저장 서비스 함수

        if (createdBoard.result === true) {
            return res.status(201).send(createdBoard)
        } else {
            return res.status(500).send(createdBoard)
        }
    })
)

/* [ /board/:boardId/edit ] 게시글 수정 */

boardRouter.get(
    // 수정 권한이 있다면 게시글 수정 페이지 조회
    '/:boardId/edit',
    wrapper(async (req, res) => {
        // console.log(req.userId)

        const accessCheckDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const foundOriginal = await boardService.getOriginalById(accessCheck)

        if (foundOriginal.result === true) {
            return res.status(200).render('board/edit.ejs', foundOriginal)
            // return res.status(200).send(foundOriginal)
        } else {
            return res.status(401).send(foundOriginal)
        }
    })
)

boardRouter.put(
    // 수정된 게시글 데이터 저장
    '/:boardId/edit',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        const updatedBoardDto = {
            boardId: req.params.boardId.split(':')[1],
            title: req.body.title,
            content: req.body.content,
        }
        const updatedBoard = await boardService.updateBoardById(updatedBoardDto)

        if (updatedBoard.result === true) {
            return res.status(201).send(updatedBoard)
        } else {
            return res.status(404).send(updatedBoard)
        }
    })
)

/* [ /board/:boardId ] 게시글 조회 */

boardRouter.get(
    // 게시글 아이디가 boardId인 게시글 조회
    '/:boardId',
    wrapper(async (req, res) => {
        const boardIdDto = { boardId: req.params.boardId.split(':')[1] }

        const foundBoard = await boardService.getBoardById(boardIdDto) // 게시글 아이디 boardId와 일치하는 조회할 게시글

        if (foundBoard.result === true) {
            return res.status(200).render('board', foundBoard) // 게시글 조회
            // return res.status(200).send(foundBoard)
        } else {
            return res.status(404).render('board', foundBoard)
        }
    })
)

boardRouter.delete(
    // 게시글 아이디가 boardId인 게시글 삭제
    '/:boardId',
    wrapper(async (req, res) => {
        // console.log(req.userId)

        const accessCheckDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const deletedBoard = await boardService.deleteBoardById(accessCheckDto)

        if (deletedBoard.result === true) {
            return res.status(200).send(deletedBoard)
        } else {
            return res.status(403).send(deletedBoard)
        }
    })
)
